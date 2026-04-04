import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import { isArray, isObject, isTuple } from "./complex.ts";
import { isConst, isNull, isNumber, isString } from "./primitive.ts";
import { isAnyOf, isOptional } from "./utility.ts";
import type { Context } from "./common.ts";

describe("Utility guards", () => {
  describe("Type tests", () => {
    it("should test isAnyOf", () => {
      const x: unknown = 42;
      if (isAnyOf(isNumber, isString)(x)) {
        assert<IsExact<typeof x, number | string>>(true);
      }
      if (isAnyOf(isNumber, isNull)(x)) {
        assert<IsExact<typeof x, number | null>>(true);
      }
    });

    it("should test isAnyOf as array member", () => {
      const x: unknown = 42;
      if (isArray(isAnyOf(isNumber, isString))(x)) {
        assert<IsExact<typeof x, (number | string)[]>>(true);
      }
    });

    it("should test isAnyOf as tuple member", () => {
      const x: unknown = 42;
      if (isTuple(isNumber, isAnyOf(isNumber, isString))(x)) {
        assert<IsExact<typeof x, [number, number | string]>>(true);
      }
    });

    it("should test isAnyOf as object member", () => {
      const x: unknown = 42;
      if (isObject({ foo: isAnyOf(isNumber, isString), bar: isNull })(x)) {
        assert<IsExact<typeof x, { foo: number | string; bar: null }>>(true);
      }
    });

    it("should test isAnyOf as discriminating union", () => {
      const x: unknown = 42;
      if (
        isAnyOf(
          isObject({ foo: isConst(42), bar: isString }),
          isObject({ foo: isConst(43), baz: isNumber }),
        )(x)
      ) {
        if (x.foo === 42) {
          assert<IsExact<typeof x.bar, string>>(true);
        } else {
          assert<IsExact<typeof x.baz, number>>(true);
        }
      }
    });
  });

  describe("isAnyOf context", () => {
    it("should set error when no guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isAnyOf(isNumber, isString)(true, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isAnyOf() failed");
    });

    it("should not set error when a guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isAnyOf(isNumber, isString)(42, ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("should clear error from failed attempts when a later guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isAnyOf(isNumber, isString)("hello", ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });
  });

  describe("isOptional context", () => {
    it("should not set error for undefined", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOptional(isNumber)(undefined, ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("should not set error for valid value", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOptional(isNumber)(42, ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("should set error when value is present but wrong type", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOptional(isNumber)("oops", ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.message, "isAnyOf() failed");
    });
  });
});

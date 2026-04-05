import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import { isArray, isObject, isTuple } from "./complex.ts";
import { isConst, isNull, isNumber, isString } from "./primitive.ts";
import { isAllOf, isOneOf, isOptional } from "./utility.ts";
import { checker } from "./checker.ts";
import type { Context } from "./common.ts";

describe("Utility guards", () => {
  describe("Type tests", () => {
    it("should test isOneOf", () => {
      const x: unknown = 42;
      if (isOneOf(isNumber, isString)(x)) {
        assert<IsExact<typeof x, number | string>>(true);
      }
      if (isOneOf(isNumber, isNull)(x)) {
        assert<IsExact<typeof x, number | null>>(true);
      }
    });

    it("should test isOneOf as array member", () => {
      const x: unknown = 42;
      if (isArray(isOneOf(isNumber, isString))(x)) {
        assert<IsExact<typeof x, (number | string)[]>>(true);
      }
    });

    it("should test isOneOf as tuple member", () => {
      const x: unknown = 42;
      if (isTuple(isNumber, isOneOf(isNumber, isString))(x)) {
        assert<IsExact<typeof x, [number, number | string]>>(true);
      }
    });

    it("should test isOneOf as object member", () => {
      const x: unknown = 42;
      if (isObject({ foo: isOneOf(isNumber, isString), bar: isNull })(x)) {
        assert<IsExact<typeof x, { foo: number | string; bar: null }>>(true);
      }
    });

    it("should test isOneOf as discriminating union", () => {
      const x: unknown = 42;
      if (
        isOneOf(
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

  describe("isOneOf context", () => {
    it("should set error when no guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOneOf(isNumber, isString)(true, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isOneOf() failed");
    });

    it("should not set error when a guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOneOf(isNumber, isString)(42, ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("should clear error from failed attempts when a later guard matches", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isOneOf(isNumber, isString)("hello", ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });
  });

  describe("isAllOf", () => {
    it("should return true when all guards match", () => {
      // isAllOf is useful for intersection-like checks, e.g. non-empty string
      const isNonEmptyString = isAllOf(isString, (v): v is string => v !== "");
      strictEqual(isNonEmptyString("hello"), true);
    });

    it("should return false when any guard fails", () => {
      const isNonEmptyString = isAllOf(isString, (v): v is string => v !== "");
      strictEqual(isNonEmptyString(""), false);
      strictEqual(isNonEmptyString(42), false);
    });

    it("should not set ctx.error on failure", () => {
      const ctx: Context = { path: [], error: null };
      const isNonEmptyString = isAllOf(isString, (v): v is string => v !== "");
      const ok = isNonEmptyString(42, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error, null);
    });

    it("should not set ctx.error on success", () => {
      const ctx: Context = { path: [], error: null };
      const isNonEmptyString = isAllOf(isString, (v): v is string => v !== "");
      const ok = isNonEmptyString("hello", ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("checker() fallback error has lambda name because isAllOf returns anonymous function", () => {
      const isNonEmptyString = isAllOf(isString, (v): v is string => v !== "");
      const chk = checker(isNonEmptyString);
      chk(42);
      strictEqual(chk.error?.path, ".");
      strictEqual(chk.error?.message, "λ() failed");
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
      strictEqual(ctx.error?.message, "isOneOf() failed");
    });
  });
});

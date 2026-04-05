import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import { isOptional } from "./utility.ts";
import { isArray, isTuple, isObject } from "./complex.ts";
import { isNumber, isString } from "./primitive.ts";
import type { Context } from "./common.ts";

describe("Complex guards", () => {
  describe("Type tests", () => {
    it("should test isArray", () => {
      const x: unknown = 42;
      if (isArray(isNumber)(x)) {
        assert<IsExact<typeof x, number[]>>(true);
      } else {
        assert<IsExact<typeof x, number[]>>(false);
      }
    });

    it("should test isTuple", () => {
      const x: unknown = 42;
      if (isTuple(isNumber, isString)(x)) {
        assert<IsExact<typeof x, [number, string]>>(true);
        assert<IsExact<typeof x, [number, number]>>(false);
        assert<IsExact<typeof x, [number, string, number]>>(false);
      } else {
        assert<IsExact<typeof x, [number, string]>>(false);
      }
    });

    it("should test isObject", () => {
      const x: unknown = 42;
      if (isObject({ foo: isNumber, bar: isString })(x)) {
        assert<IsExact<typeof x, { foo: number; bar: string }>>(true);
        assert<IsExact<typeof x, { foo: number }>>(false);
        assert<IsExact<typeof x, { foo: number; bar: string; baz: string }>>(
          false,
        );
      } else {
        assert<IsExact<typeof x, { foo: number; bar: string }>>(false);
      }
    });

    it("should test isObject with an optional field", () => {
      const x: unknown = 42;
      if (isObject({ foo: isNumber, bar: isOptional(isString) })(x)) {
        assert<IsExact<typeof x, { foo: number; bar?: string }>>(true);
      }
    });
  });

  describe("isObject extraKeys", () => {
    it("should allow extra keys by default", () => {
      const ok = isObject({ foo: isNumber })({ foo: 1, bar: "extra" });
      strictEqual(ok, true);
    });

    it("should reject extra keys when extraKeys is false", () => {
      const ok = isObject(
        { foo: isNumber },
        { extraKeys: false },
      )({
        foo: 1,
        bar: "extra",
      });
      strictEqual(ok, false);
    });

    it("should accept exact match when extraKeys is false", () => {
      const ok = isObject({ foo: isNumber }, { extraKeys: false })({ foo: 1 });
      strictEqual(ok, true);
    });

    it("should set error when extra keys found and extraKeys is false", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isObject({ foo: isNumber }, { extraKeys: false })(
        { foo: 1, bar: "extra" },
        ctx,
      );
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isObject() failed: extra keys found");
    });
  });

  describe("isObject context", () => {
    it("should set error when value is not an object", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isObject({ foo: isNumber })(42, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isObject() failed: not a plain object");
    });

    it("should set error path for a failing field", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isObject({ foo: isNumber, bar: isString })(
        { foo: 1, bar: 42 },
        ctx,
      );
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".bar");
      strictEqual(ctx.error?.message, "isString() failed");
    });

    it("should set nested error path", () => {
      const ctx: Context = { path: [], error: null };
      const guard = isObject({ user: isObject({ age: isNumber }) });
      const ok = guard({ user: { age: "oops" } }, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".user.age");
      strictEqual(ctx.error?.message, "isNumber() failed");
    });

    it("should not set error on valid data", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isObject({ foo: isNumber })({ foo: 1 }, ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });

    it("should set deeply nested error path", () => {
      const ctx: Context = { path: [], error: null };
      const guard = isObject({
        a: isObject({
          b: isObject({
            c: isNumber,
          }),
        }),
      });
      const ok = guard({ a: { b: { c: "oops" } } }, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".a.b.c");
      strictEqual(ctx.error?.message, "isNumber() failed");
    });
  });

  describe("isArray minLength/maxLength", () => {
    it("should accept array within length bounds", () => {
      strictEqual(
        isArray(isNumber, { minLength: 1, maxLength: 3 })([1, 2]),
        true,
      );
    });

    it("should reject array shorter than minLength", () => {
      strictEqual(isArray(isNumber, { minLength: 2 })([]), false);
    });

    it("should reject array longer than maxLength", () => {
      strictEqual(isArray(isNumber, { maxLength: 2 })([1, 2, 3]), false);
    });

    it("should set error when array is too short", () => {
      const ctx: Context = { path: [], error: null };
      isArray(isNumber, { minLength: 2 })([], ctx);
      strictEqual(ctx.error?.message, "isArray() failed: wrong length");
    });

    it("should set error when array is too long", () => {
      const ctx: Context = { path: [], error: null };
      isArray(isNumber, { maxLength: 2 })([1, 2, 3], ctx);
      strictEqual(ctx.error?.message, "isArray() failed: wrong length");
    });
  });

  describe("isArray context", () => {
    it("should set error when value is not an array", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isArray(isNumber)(42, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isArray() failed: not an array");
    });

    it("should set error path for a failing element", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isArray(isNumber)([1, 2, "oops"], ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, "[2]");
      strictEqual(ctx.error?.message, "isNumber() failed");
    });

    it("should not set error on valid data", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isArray(isNumber)([1, 2, 3], ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });
  });

  describe("isTuple context", () => {
    it("should set error when value is not an array or wrong length", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isTuple(isNumber, isString)(42, ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isTuple() failed: not an array");
    });

    it("should set error when tuple length doesn't match", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isTuple(isNumber, isString)([1], ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, ".");
      strictEqual(ctx.error?.message, "isTuple() failed: wrong length");
    });

    it("should set error path for a failing element", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isTuple(isNumber, isString)([1, 42], ctx);
      strictEqual(ok, false);
      strictEqual(ctx.error?.path, "[1]");
      strictEqual(ctx.error?.message, "isString() failed");
    });

    it("should not set error on valid data", () => {
      const ctx: Context = { path: [], error: null };
      const ok = isTuple(isNumber, isString)([1, "hello"], ctx);
      strictEqual(ok, true);
      strictEqual(ctx.error, null);
    });
  });
});

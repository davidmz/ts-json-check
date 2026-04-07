import { describe, it } from "node:test";
import { strictEqual, ok } from "node:assert";
import { checker } from "./checker.ts";
import { isNumber, isString } from "./primitive.ts";
import { isObject } from "./complex.ts";
import { CheckError, named } from "./common.ts";

describe("checker", () => {
  it("should return true and clear error on valid data", () => {
    const chk = checker(isNumber);
    strictEqual(chk(42), true);
    strictEqual(chk.error, null);
  });

  it("should return false and set error on invalid data", () => {
    const chk = checker(isNumber);
    strictEqual(chk("oops"), false);
    ok(chk.error instanceof CheckError);
    strictEqual(chk.error?.path, ".");
    strictEqual(chk.error?.message, "isNumber() failed");
  });

  it("should narrow the type on success", () => {
    const chk = checker(isNumber);
    const x: unknown = 42;
    if (chk(x)) {
      // x is number here — compile-time check
      const n: number = x;
      strictEqual(n, 42);
    }
  });

  it("should set path and message for nested object failure", () => {
    const chk = checker(isObject({ user: isObject({ age: isNumber }) }));
    strictEqual(chk({ user: { age: "oops" } }), false);
    strictEqual(chk.error?.path, ".user.age");
    strictEqual(chk.error?.message, "isNumber() failed");
  });

  it("should clear error between calls", () => {
    const chk = checker(isString);
    chk(42);
    ok(chk.error !== null);
    chk("hello");
    strictEqual(chk.error, null);
  });

  it("error should carry both path and message separately", () => {
    const chk = checker(isObject({ foo: isNumber }));
    chk({ foo: "oops" });
    strictEqual(chk.error?.path, ".foo");
    strictEqual(chk.error?.message, "isNumber() failed");
  });

  describe("named", () => {
    it("should use displayName in error message instead of function name", () => {
      const isUser = named("isUser", isObject({ id: isNumber }));
      const chk = checker(isUser);
      chk({ id: "oops" });
      strictEqual(chk.error?.message, "isNumber() failed");
    });

    it("should use displayName when custom guard is used as a field in isObject", () => {
      const isPositiveNumber = named(
        "isPositiveNumber",
        (v: unknown): v is number => typeof v === "number" && v > 0,
      );
      const chk = checker(isObject({ count: isPositiveNumber }));
      chk({ count: -1 });
      strictEqual(chk.error?.path, ".count");
      strictEqual(chk.error?.message, "isPositiveNumber() failed");
    });

    it("should use displayName for a custom guard after minification", () => {
      // Simulates a minified guard with a meaningless name
      const a = (v: unknown): v is number => typeof v === "number" && v > 0;
      named("isPositiveNumber", a);
      const chk = checker(isObject({ count: a }));
      chk({ count: -1 });
      strictEqual(chk.error?.path, ".count");
      strictEqual(chk.error?.message, "isPositiveNumber() failed");
    });
  });

  describe("nested checkers", () => {
    const checkAAddress = checker(isObject({ street: isString }));
    const checkUser = checker(
      isObject({ name: isString, address: checkAAddress }),
    );

    it("should handle nested checkers correctly", () => {
      const result = checkUser({
        name: "John",
        address: { street: "123 Main St" },
      });
      strictEqual(result, true);
      strictEqual(checkUser.error, null);
    });

    it("should handle nested checkers with error", () => {
      const result = checkUser({
        name: "John",
        address: { street: 123 },
      });
      strictEqual(result, false);
      strictEqual(checkUser.error?.path, ".address.street");
      strictEqual(checkUser.error?.message, "isString() failed");
    });

    it("should handle checker(checker()) correctly", () => {
      const chk = checker(checkUser);
      const result = chk({
        name: "John",
        address: { street: "123 Main St" },
      });
      strictEqual(result, true);
      strictEqual(chk.error, null);
    });

    it("should handle checker(checker()) with error", () => {
      const chk = checker(checkUser);
      const result = chk({
        name: "John",
        address: { street: 123 },
      });
      strictEqual(result, false);
      strictEqual(chk.error?.path, ".address.street");
      strictEqual(chk.error?.message, "isString() failed");
    });
  });
});

import { describe, it } from "node:test";
import { strictEqual, ok } from "node:assert";
import { checker } from "./checker.ts";
import { isNumber, isString } from "./primitive.ts";
import { isObject } from "./complex.ts";
import { CheckError } from "./common.ts";

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
});

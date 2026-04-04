import { describe, it } from "node:test";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import { isArray, isObject, isTuple } from "./complex.ts";
import { isConst, isNull, isNumber, isString } from "./primitive.ts";
import { isAnyOf } from "./utility.ts";

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
});

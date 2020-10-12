import { assert, IsExact } from "conditional-type-checks";
import { isOptional } from "./utility";
import { isArray, isTuple, isObject } from "./complex";
import { isNumber, isString } from "./primitive";

describe("Complex guards", () => {
  describe("Type tests", () => {
    it("should test isArray", () => {
      const x: any = 42;
      if (isArray(isNumber)(x)) {
        assert<IsExact<typeof x, number[]>>(true);
      } else {
        assert<IsExact<typeof x, number[]>>(false);
      }
    });

    it("should test isTuple", () => {
      const x: any = 42;
      if (isTuple(isNumber, isString)(x)) {
        assert<IsExact<typeof x, [number, string]>>(true);
        assert<IsExact<typeof x, [number, number]>>(false);
        assert<IsExact<typeof x, [number, string, number]>>(false);
      } else {
        assert<IsExact<typeof x, [number, string]>>(false);
      }
    });

    it("should test isObject", () => {
      const x: any = 42;
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
      const x: any = 42;
      if (isObject({ foo: isNumber, bar: isOptional(isString) })(x)) {
        assert<IsExact<typeof x, { foo: number; bar?: string }>>(true);
      }
    });
  });
});

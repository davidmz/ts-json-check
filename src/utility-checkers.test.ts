import { assert, IsExact } from "conditional-type-checks";
import { isObject } from "./complex-checkers";
import { isNumber, isString } from "./primitive-checkers";
import { isAnyOf, isOptional } from "./utility-checkers";

describe("Utility checkers", () => {
  describe("isAnyOf", () => {
    it(`should produce valid type`, () => {
      const checker = isAnyOf(isNumber, isString);
      assert<IsExact<ReturnType<typeof checker>, number | string>>(true);
    });

    it(`should check valid types`, () => {
      const checker = isAnyOf(isNumber, isString);
      assert<IsExact<ReturnType<typeof checker>, number | string>>(true);
      expect(() => checker(42)).not.toThrow();
      expect(() => checker("42")).not.toThrow();
    });

    it(`should not check invalid value`, () => {
      const checker = isAnyOf(isNumber, isString);
      expect(() => checker([42])).toThrow();
    });
  });

  describe("isOptional", () => {
    it(`should check valid types`, () => {
      const checker = isOptional(isNumber);
      expect(() => checker(42)).not.toThrow();
      expect(() => checker(void 0)).not.toThrow();
    });

    it(`should check missed fields of objects`, () => {
      const checker = isObject({ foo: isOptional(isNumber), bar: isString });
      assert<
        IsExact<ReturnType<typeof checker>, { foo?: number; bar: string }>
      >(true);
      expect(() => checker({ foo: 42, bar: "baz" })).not.toThrow();
      expect(() => checker({ bar: "baz" })).not.toThrow();
    });

    it(`should not check invalid value`, () => {
      const checker = isOptional(isNumber);
      expect(() => checker([42])).toThrow();
    });
  });
});

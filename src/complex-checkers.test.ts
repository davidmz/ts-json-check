import { isObject, isArray, isTuple } from "./complex-checkers";
import { isNull, isNumber, isString } from "./primitive-checkers";
import { assert, IsExact } from "conditional-type-checks";

describe("Complex types checkers", () => {
  describe("isObject", () => {
    it(`should produce valid type`, () => {
      const checker = isObject({
        foo: isNull,
        bar: isNumber,
        baz: isString,
      });
      assert<
        IsExact<
          ReturnType<typeof checker>,
          { foo: null; bar: number; baz: string }
        >
      >(true);
    });

    it(`should not allow to use non-object as template`, () => {
      expect(() => isObject([isNumber])).toThrow();
    });

    it(`should not check non-plain object`, () => {
      const checker = isObject({
        foo: isNull,
        bar: isNumber,
        baz: isString,
      });
      expect(() => checker([1, 2, 3])).toThrow();
    });

    it(`should check type of shallow object`, () => {
      const checker = isObject({
        foo: isNull,
        bar: isNumber,
        baz: isString,
      });
      const data = {
        foo: null,
        bar: 42,
        baz: "bazz",
      };

      expect(checker(data)).toBe(data);
    });

    it(`should check type of deep object`, () => {
      const checker = isObject({
        foo: isNull,
        bar: isNumber,
        baz: isObject({
          title: isString,
          price: isNumber,
        }),
      });

      const data: any = {
        foo: null,
        bar: 42,
        baz: { title: "bazz", price: 45 },
      };

      expect(checker(data)).toBe(data);

      const res = checker(data);

      assert<IsExact<typeof res.foo, null>>(true);
      assert<IsExact<typeof res.baz.price, number>>(true);
    });
  });

  describe("isArray", () => {
    it(`should produce valid type`, () => {
      const checker = isArray(isNumber);
      assert<IsExact<ReturnType<typeof checker>, number[]>>(true);
    });

    it(`should check type of primitive array`, () => {
      const checker = isArray(isNumber);
      const data: any = [1, 2, 3, 4];
      expect(() => checker(data)).not.toThrow();

      const res = checker(data);
      assert<IsExact<typeof res, number[]>>(true);
    });

    it(`should not accept non-array data`, () => {
      const checker = isArray(isNumber);
      expect(() => checker({ a: 1 })).toThrow();
    });

    it(`should check type of array of arrays`, () => {
      const checker = isArray(isArray(isNumber));
      const data: any = [[1], [2, 3], [4, 5, 6]];
      expect(() => checker(data)).not.toThrow();

      const res = checker(data);
      assert<IsExact<typeof res, number[][]>>(true);
    });

    it(`should check type of array of objects`, () => {
      const checker = isArray(isObject({ foo: isNumber }));
      const data: any = [{ foo: 1 }, { foo: 2 }];
      expect(() => checker(data)).not.toThrow();

      const res = checker(data);
      assert<IsExact<typeof res, { foo: number }[]>>(true);
    });
  });

  describe("isTuple", () => {
    it(`should return the correct type`, () => {
      const checker = isTuple(isNumber, isString);
      assert<IsExact<ReturnType<typeof checker>, [number, string]>>(true);
    });

    it(`should not check non-array data`, () => {
      const checker = isTuple(isNumber, isString);
      expect(() => checker(42)).toThrow();
    });

    it(`should not check array of different length`, () => {
      const checker = isTuple(isNumber, isString);
      expect(() => checker([42])).toThrow();
    });

    it(`should check array data`, () => {
      const checker = isTuple(isNumber, isString);
      expect(() => checker([42, ""])).not.toThrow();
    });
  });
});

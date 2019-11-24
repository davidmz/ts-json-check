import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
  isConst,
} from "./primitive-checkers";
import { Checker } from "./common";

const testData = [
  { name: "undefined", value: void 0 },
  { name: "null", value: null },
  { name: "number", value: 42 },
  { name: "string", value: "42" },
  { name: "boolean", value: false },
  { name: "object", value: { foo: "bar" } },
  { name: "date", value: new Date() },
  { name: "array", value: [1, 2, 3] },
];

function testChecker<T>(checker: Checker<T>, validName: string) {
  for (const { name, value } of testData) {
    if (name === validName) {
      it(`should check for ${name}`, () => {
        expect(checker(value)).toBe(value);
      });
    } else {
      it(`should throw error on ${name}`, () => {
        expect(() => checker(value)).toThrow();
      });
    }
  }
}

describe("Primitive types checkers", () => {
  describe("isNull", () => testChecker(isNull, "null"));
  describe("isNumber", () => testChecker(isNumber, "number"));
  describe("isString", () => testChecker(isString, "string"));
  describe("isBoolean", () => testChecker(isBoolean, "boolean"));
  describe("isUndefined", () => testChecker(isUndefined, "undefined"));
});

describe("Constant types checker", () => {
  it("should check constant of type number", () => {
    const data = 42;
    const checker = isConst(42);
    expect(() => checker(data)).not.toThrow();
    expect(checker(data)).toBe(data);
  });

  it("should fail on bad type", () => {
    const data = "q";
    const checker = isConst(42);
    expect(() => checker(data)).toThrow();
  });

  it("should fail on bad value", () => {
    const data = 43;
    const checker = isConst(42);
    expect(() => checker(data)).toThrow();
  });

  it("should fail on non-primitive type", () => {
    const data = [43];
    const checker = isConst(42);
    expect(() => checker(data)).toThrow();
  });
});

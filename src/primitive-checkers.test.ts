import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
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

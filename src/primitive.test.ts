import { describe, it } from "node:test";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import {
  isNull,
  isUndefined,
  isNumber,
  isString,
  isBoolean,
  isAny,
  isConst,
  isUnknown,
} from "./primitive.ts";

describe("Primitive guards", () => {
  describe("Type tests", () => {
    it("should test isNull", () => {
      const x: unknown = 42;
      if (isNull(x)) {
        assert<IsExact<typeof x, null>>(true);
      } else {
        assert<IsExact<typeof x, null>>(false);
      }
    });

    it("should test isUndefined", () => {
      const x: unknown = 42;
      if (isUndefined(x)) {
        assert<IsExact<typeof x, undefined>>(true);
      } else {
        assert<IsExact<typeof x, undefined>>(false);
      }
    });

    it("should test isNumber", () => {
      const x: unknown = 42;
      if (isNumber(x)) {
        assert<IsExact<typeof x, number>>(true);
      } else {
        assert<IsExact<typeof x, number>>(false);
      }
    });

    it("should test isString", () => {
      const x: unknown = 42;
      if (isString(x)) {
        assert<IsExact<typeof x, string>>(true);
      } else {
        assert<IsExact<typeof x, string>>(false);
      }
    });

    it("should test isBoolean", () => {
      const x: unknown = 42;
      if (isBoolean(x)) {
        assert<IsExact<typeof x, boolean>>(true);
      } else {
        assert<IsExact<typeof x, boolean>>(false);
      }
    });

    it("should test isAny", () => {
      const x: unknown = 42;
      if (isAny(x)) {
        assert<IsExact<typeof x, any>>(true);
      } else {
        assert<IsExact<typeof x, any>>(false);
      }
    });

    it("should test isUnknown", () => {
      const x: unknown = 42;
      if (isUnknown(x)) {
        assert<IsExact<typeof x, unknown>>(true);
      } else {
        assert<IsExact<typeof x, unknown>>(false);
      }
    });

    it("should test isConst", () => {
      const x: unknown = 42;
      if (isConst(43)(x)) {
        assert<IsExact<typeof x, 43>>(true);
      } else {
        assert<IsExact<typeof x, 43>>(false);
      }
    });

    it("should test isConst with multiple values", () => {
      const x: unknown = 42;
      if (isConst(43, "foo")(x)) {
        assert<IsExact<typeof x, 43 | "foo">>(true);
      }
    });
  });
});

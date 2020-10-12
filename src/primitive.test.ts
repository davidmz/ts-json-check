import { assert, IsExact } from "conditional-type-checks";
import {
  isNull,
  isUndefined,
  isNumber,
  isString,
  isBoolean,
  isAny,
  isConst,
} from "./primitive";

describe("Primitive guards", () => {
  describe("Type tests", () => {
    it("should test isNull", () => {
      const x: any = 42;
      if (isNull(x)) {
        assert<IsExact<typeof x, null>>(true);
      } else {
        assert<IsExact<typeof x, null>>(false);
      }
    });

    it("should test isUndefined", () => {
      const x: any = 42;
      if (isUndefined(x)) {
        assert<IsExact<typeof x, undefined>>(true);
      } else {
        assert<IsExact<typeof x, undefined>>(false);
      }
    });

    it("should test isNumber", () => {
      const x: any = 42;
      if (isNumber(x)) {
        assert<IsExact<typeof x, number>>(true);
      } else {
        assert<IsExact<typeof x, number>>(false);
      }
    });

    it("should test isString", () => {
      const x: any = 42;
      if (isString(x)) {
        assert<IsExact<typeof x, string>>(true);
      } else {
        assert<IsExact<typeof x, string>>(false);
      }
    });

    it("should test isBoolean", () => {
      const x: any = 42;
      if (isBoolean(x)) {
        assert<IsExact<typeof x, boolean>>(true);
      } else {
        assert<IsExact<typeof x, boolean>>(false);
      }
    });

    it("should test isAny", () => {
      const x: any = 42;
      if (isAny(x)) {
        assert<IsExact<typeof x, any>>(true);
      } else {
        assert<IsExact<typeof x, any>>(false);
      }
    });

    it("should test isConst", () => {
      const x: any = 42;
      if (isConst(43)(x)) {
        assert<IsExact<typeof x, 43>>(true);
      } else {
        assert<IsExact<typeof x, 43>>(false);
      }
    });

    it("should test isConst with multiple values", () => {
      const x: any = 42;
      if (isConst(43, "foo")(x)) {
        assert<IsExact<typeof x, 43 | "foo">>(true);
      }
    });
  });
});

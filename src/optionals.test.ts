import { assert, IsExact } from "conditional-type-checks";
import { UndefinedAsOptional } from "./optional";

describe("Optional", () => {
  it("should test UndefinedAsOptional", () => {
    assert<
      IsExact<
        UndefinedAsOptional<{
          foo: string;
          bar: number;
        }>,
        {
          foo: string;
          bar: number;
        }
      >
    >(true);

    assert<
      IsExact<
        UndefinedAsOptional<{
          foo: string;
          bar: number | undefined;
        }>,
        {
          foo: string;
          bar?: number;
        }
      >
    >(true);

    assert<
      IsExact<
        UndefinedAsOptional<{
          foo: string | undefined;
          bar: number | undefined;
        }>,
        {
          foo?: string;
          bar?: number;
        }
      >
    >(true);
  });
});

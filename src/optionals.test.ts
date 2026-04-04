import { describe, it } from "node:test";
import type { IsExact } from "conditional-type-checks";
import { assert } from "conditional-type-checks";
import type { UndefinedAsOptional } from "./optional.ts";

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

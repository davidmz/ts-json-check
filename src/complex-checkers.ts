import isPlainObject from "lodash.isplainobject";
import { CombinedChecker, Checker, nameOf, CombinedResult } from "./common";

export function isObject<T extends object>(
  template: CombinedChecker<T>,
): Checker<CombinedResult<typeof template>> {
  if (!isPlainObject(template)) {
    throw new Error(`${template} is not a plain object`);
  }

  const tKeys = Object.keys(template) as (keyof typeof template)[];

  const thisChecker: Checker<
    CombinedResult<typeof template>
  > = function isObject(v: any) {
    if (!isPlainObject(v)) {
      throw new Error(`${v} is not a plain object`);
    }

    for (const k of tKeys) {
      template[k](v[k]);
    }

    return v;
  };

  thisChecker.displayName = `${thisChecker.name}(${tKeys
    .map((k) => `${k}: ${nameOf(template[k])}`)
    .join(", ")})`;

  return thisChecker;
}

export function isArray<T>(checker: Checker<T>) {
  const thisChecker: Checker<T[]> = function isArray(v: any) {
    if (!Array.isArray(v)) {
      throw new Error(`${v} is not an array`);
    }
    v.forEach((el) => checker(el));

    return v as T[];
  };

  thisChecker.displayName = `${thisChecker.name}(${nameOf(checker)})`;
  return thisChecker;
}

export function isTuple<T extends [unknown, ...unknown[]]>(
  ...checkers: CombinedChecker<T>
) {
  const thisChecker: Checker<T> = function isTuple(v: any) {
    if (!Array.isArray(v)) {
      throw new Error(`${v} is not an array`);
    }

    if (checkers.length !== v.length) {
      throw new Error(`length of ${v} is not match to template`);
    }

    for (let i = 0; i < checkers.length; i++) {
      checkers[i](v[i]);
    }

    return v as T;
  };

  thisChecker.displayName = `${thisChecker.name}(${checkers
    .map(nameOf)
    .join(", ")})`;
  return thisChecker;
}

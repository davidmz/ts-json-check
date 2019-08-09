import { isUndefined } from "./primitive-checkers";
import { Checker, CombinedChecker, nameOf } from "./common";

export function isAnyOf<T extends [unknown, unknown, ...unknown[]]>(
  ...checkers: CombinedChecker<T>
) {
  const thisChecker: Checker<T[number]> = function isAnyOf(v: any) {
    for (const c of checkers) {
      try {
        return c(v);
      } catch (e) {}
    }
    throw new Error(`${v} is not matches to ${nameOf(thisChecker)}`);
  };

  thisChecker.displayName = `${thisChecker.name}(${checkers
    .map(nameOf)
    .join(", ")})`;

  return thisChecker;
}

export function isOptional<T>(checker: Checker<T>) {
  const thisChecker = isAnyOf(checker, isUndefined);
  thisChecker.displayName = `${isOptional.name}(${nameOf(checker)})`;
  return thisChecker;
}

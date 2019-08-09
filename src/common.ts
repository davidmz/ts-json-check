import { Optional } from "utility-types";

export type Checker<T> = ((v: any) => T) & { displayName?: string };

export type CombinedChecker<T> = { [K in keyof T]-?: Checker<T[K]> };

export function nameOf<T>(c: Checker<T>) {
  return c.displayName || c.name || "unknown";
}

/**
 * Returns result type of CombinedChecker
 *
 * We can just use T of CombinedChecker<T> but in that way we won't get
 * optional fields. The CombinedResult makes isOptional fields really optional.
 */
export type CombinedResult<T extends CombinedChecker<any>> = _Id<
  Optional<_AllResults<T>, _OptionalKeys<_AllResults<T>>>
>;

// Flattens intersected (&) types
export type _Id<T> = { [K in keyof T]: T[K] };

export type _AllResults<T extends CombinedChecker<any>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export type _OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

import { CheckError } from "./common.ts";
import type { Guard, Context } from "./common.ts";
import { isUndefined } from "./primitive.ts";

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

/**
 * Checks if a value matches any of the provided guards
 *
 * @param guards - The guards to check against
 * @returns A guard that checks if the value matches any of the provided guards
 */
export function isOneOf<T extends [unknown, unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T[number]> {
  return (v: unknown, ctx?: Context): v is T[number] => {
    for (const g of guards) {
      if (ctx) ctx.error = null;
      if (g(v, ctx)) {
        if (ctx) ctx.error = null;
        return true;
      }
    }
    if (ctx) ctx.error = new CheckError(ctx.path, "isOneOf() failed");
    return false;
  };
}

/**
 * Checks if a value matches all of the provided guards
 *
 * @param guards - The guards to check against
 * @returns A guard that checks if the value matches all of the provided guards
 */
export function isAllOf<T extends [unknown, unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<UnionToIntersection<T[number]>> {
  return (v: unknown, ctx?: Context): v is UnionToIntersection<T[number]> => {
    for (const g of guards) {
      if (ctx) ctx.error = null;
      if (!g(v, ctx)) {
        if (ctx) ctx.error = null;
        return false;
      }
    }
    return true;
  };
}

/**
 * @deprecated Use `isOneOf` instead
 */
export const isAnyOf = isOneOf;

/**
 * Checks if a value is optional (undefined or matches the provided guard)
 *
 * @param g - The guard to check against
 * @returns A guard that checks if the value is optional
 */
export function isOptional<T>(g: Guard<T>) {
  return isOneOf(g, isUndefined);
}

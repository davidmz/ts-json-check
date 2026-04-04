import type { Guard } from "./common.ts";
import { isUndefined } from "./primitive.ts";

export function isAnyOf<T extends [unknown, unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T[number]> {
  return (v: any): v is T[number] => guards.some((g) => g(v));
}

export function isOptional<T>(g: Guard<T>) {
  return isAnyOf(g, isUndefined);
}

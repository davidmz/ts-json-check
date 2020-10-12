import { Guard } from "./common";
import { isUndefined } from "./primitive";

export function isAnyOf<T extends [unknown, unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T[number]> {
  return (v: any): v is T[number] => guards.some((g) => g(v));
}

export function isOptional<T>(g: Guard<T>) {
  return isAnyOf(g, isUndefined);
}

import type { JSONPrimitive, Guard } from "./common.ts";

export function isNull(v: unknown): v is null {
  return v === null;
}

export function isUndefined(v: unknown): v is undefined {
  return v === undefined;
}

export function isNumber(v: unknown): v is number {
  return typeof v === "number";
}

export function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}

export function isConst<T extends [JSONPrimitive, ...JSONPrimitive[]]>(
  ...konsts: T
): Guard<T[number]> {
  return (v: unknown): v is T[number] => konsts.some((k) => v === k);
}

export function isAny(v: unknown): v is any {
  return v === v;
}

export function isUnknown(v: unknown): v is unknown {
  return v === v;
}

import type { JSONPrimitive, Guard } from "./common.ts";

export function isNull(v: unknown): v is null {
  return v === null;
}
isNull.displayName = "isNull";

export function isUndefined(v: unknown): v is undefined {
  return v === undefined;
}
isUndefined.displayName = "isUndefined";

export function isNumber(v: unknown): v is number {
  return typeof v === "number";
}
isNumber.displayName = "isNumber";

export function isString(v: unknown): v is string {
  return typeof v === "string";
}
isString.displayName = "isString";

export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}
isBoolean.displayName = "isBoolean";

export function isConst<T extends [JSONPrimitive, ...JSONPrimitive[]]>(
  ...konsts: T
): Guard<T[number]> {
  return (v: unknown): v is T[number] => konsts.some((k) => v === k);
}

export function isAny(_v: unknown): _v is any {
  return true;
}
isAny.displayName = "isAny";

export function isUnknown(_v: unknown): _v is unknown {
  return true;
}
isUnknown.displayName = "isUnknown";

import { JSONPrimitive, Guard } from "./common";

export function isNull(v: any): v is null {
  return v === null;
}

export function isUndefined(v: any): v is undefined {
  return v === undefined;
}

export function isNumber(v: any): v is number {
  return typeof v === "number";
}

export function isString(v: any): v is string {
  return typeof v === "string";
}

export function isBoolean(v: any): v is boolean {
  return typeof v === "boolean";
}

export function isConst<T extends [JSONPrimitive, ...JSONPrimitive[]]>(
  ...konsts: T
): Guard<T[number]> {
  return (v: any): v is T[number] => konsts.some((k) => v === k);
}

export function isAny(v: any): v is any {
  return v === v;
}

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

export function isConst<T extends JSONPrimitive>(konst: T): Guard<T> {
  return (v: any): v is T => v === konst;
}

export function isAny(v: any): v is any {
  return v === v;
}

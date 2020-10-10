import isPlainObject from "lodash.isplainobject";
import { Guard } from "./common";
import { UndefinedAsOptional } from "./optional";

export function isArray<T>(g: Guard<T>): Guard<T[]> {
  return (v: any): v is T[] => Array.isArray(v) && v.every((x) => g(x));
}

export function isTuple<T extends [unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T> {
  return (v: any): v is T =>
    Array.isArray(v) &&
    v.length === guards.length &&
    v.every((x, i) => guards[i](x));
}

export function isObject<T>(shape: { [K in keyof T]: Guard<T[K]> }) {
  return (v: any): v is UndefinedAsOptional<T> =>
    isPlainObject(v) &&
    (Object.keys(shape) as (keyof T)[]).every((k) => shape[k](v[k]));
}

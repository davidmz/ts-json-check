import { CheckError } from "./common.ts";
import type { Guard, Context } from "./common.ts";
import type { UndefinedAsOptional } from "./optional.ts";

export function isArray<T>(g: Guard<T>): Guard<T[]> {
  return (v: unknown, ctx?: Context): v is T[] => {
    if (!Array.isArray(v)) {
      if (ctx) ctx.error = new CheckError(ctx.path, "isArray() failed");
      return false;
    }
    for (let i = 0; i < v.length; i++) {
      ctx?.path.push(i);
      if (!g(v[i], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(ctx.path, `${g.name}() failed`);
        return false;
      }
      ctx?.path.pop();
    }
    return true;
  };
}

export function isTuple<T extends [unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T> {
  return (v: unknown, ctx?: Context): v is T => {
    if (!Array.isArray(v) || v.length !== guards.length) {
      if (ctx) ctx.error = new CheckError(ctx.path, "isTuple() failed");
      return false;
    }
    for (let i = 0; i < guards.length; i++) {
      ctx?.path.push(i);
      if (!guards[i](v[i], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(ctx.path, `${guards[i].name}() failed`);
        return false;
      }
      ctx?.path.pop();
    }
    return true;
  };
}

export function isObject<T>(shape: { [K in keyof T]: Guard<T[K]> }) {
  return (v: any, ctx?: Context): v is UndefinedAsOptional<T> => {
    if (!isPlainObject(v)) {
      if (ctx) ctx.error = new CheckError(ctx.path, "isObject() failed");
      return false;
    }
    for (const k of Object.keys(shape) as Exclude<keyof T, symbol>[]) {
      ctx?.path.push(k);
      if (!shape[k](v[k], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(ctx.path, `${shape[k].name}() failed`);
        return false;
      }
      ctx?.path.pop();
    }
    return true;
  };
}

function isPlainObject(v: unknown): boolean {
  if (!v || typeof v !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(v) as typeof Object.prototype | null;
  return proto === Object.prototype;
}

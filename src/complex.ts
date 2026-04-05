import { CheckError, guardName } from "./common.ts";
import type { Guard, Context } from "./common.ts";
import type { UndefinedAsOptional } from "./optional.ts";

export function isArray<T>(g: Guard<T>): Guard<T[]> {
  return (v: unknown, ctx?: Context): v is T[] => {
    if (!Array.isArray(v)) {
      if (ctx)
        ctx.error = new CheckError(ctx.path, "isArray() failed: not an array");
      return false;
    }
    for (let i = 0; i < v.length; i++) {
      ctx?.path.push(i);
      if (!g(v[i], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(ctx.path, `${guardName(g)}() failed`);
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
    if (!Array.isArray(v)) {
      if (ctx)
        ctx.error = new CheckError(ctx.path, "isTuple() failed: not an array");
      return false;
    }
    if (v.length !== guards.length) {
      if (ctx)
        ctx.error = new CheckError(ctx.path, "isTuple() failed: wrong length");
      return false;
    }
    for (let i = 0; i < guards.length; i++) {
      ctx?.path.push(i);
      if (!guards[i](v[i], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(
            ctx.path,
            `${guardName(guards[i])}() failed`,
          );
        return false;
      }
      ctx?.path.pop();
    }
    return true;
  };
}

export function isObject<T>(
  shape: { [K in keyof T]: Guard<T[K]> },
  { extraKeys = true } = {},
) {
  return (v: any, ctx?: Context): v is UndefinedAsOptional<T> => {
    if (!isPlainObject(v)) {
      if (ctx)
        ctx.error = new CheckError(
          ctx.path,
          "isObject() failed: not a plain object",
        );
      return false;
    }
    const shapeKeys = Object.keys(shape) as Exclude<keyof T, symbol>[];
    const valueKeys = new Set(Object.keys(v) as Exclude<keyof T, symbol>[]);
    for (const k of shapeKeys) {
      ctx?.path.push(k);
      if (!shape[k](v[k], ctx)) {
        if (ctx && !ctx.error)
          ctx.error = new CheckError(
            ctx.path,
            `${guardName(shape[k])}() failed`,
          );
        return false;
      }
      ctx?.path.pop();
      valueKeys.delete(k);
    }
    if (!extraKeys && valueKeys.size > 0) {
      if (ctx)
        ctx.error = new CheckError(
          ctx.path,
          "isObject() failed: extra keys found",
        );
      return false;
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

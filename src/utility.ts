import { CheckError } from "./common.ts";
import type { Guard, Context } from "./common.ts";
import { isUndefined } from "./primitive.ts";

export function isAnyOf<T extends [unknown, unknown, ...unknown[]]>(
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
    if (ctx)
      ctx.error = new CheckError(ctx.path, "isAnyOf() failed");
    return false;
  };
}

export function isOptional<T>(g: Guard<T>) {
  return isAnyOf(g, isUndefined);
}

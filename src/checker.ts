import { CheckError } from "./common.ts";
import type { Context, Guard, CheckerGuard } from "./common.ts";

export function checker<T>(guard: Guard<T>): CheckerGuard<T> {
  let lastError: CheckError | null = null;

  const fn = (v: unknown, ctx?: Context): v is T => {
    if (ctx) {
      const ok = guard(v, ctx);
      lastError = ok
        ? null
        : (ctx.error ?? new CheckError(ctx.path, `${guard.name}() failed`));
      if (!ok && !ctx.error) ctx.error = lastError;
      return ok;
    }
    const localCtx: Context = { path: [], error: null };
    const ok = guard(v, localCtx);
    lastError = ok
      ? null
      : (localCtx.error ?? new CheckError([], `${guard.name}() failed`));
    return ok;
  };

  Object.defineProperty(fn, "error", { get: () => lastError });
  return fn as CheckerGuard<T>;
}

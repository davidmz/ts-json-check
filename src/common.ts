/**
 * Context for error tracking during validation
 */
export interface Context {
  path: (string | number)[];
  error: CheckError | null;
}

export class CheckError extends Error {
  readonly path: string;
  readonly message: string;

  constructor(path: (string | number)[], message: string) {
    const pathStr = pathToString(path);
    super(`${pathStr}: ${message}`);
    this.name = "CheckError";
    this.path = pathStr;
    this.message = message;
  }
}

export interface CheckerGuard<T> extends Guard<T> {
  error: CheckError | null;
}

export type Guard<T> = (v: unknown, context?: Context) => v is T;

export type JSONPrimitive = null | string | number | boolean;

export type GuardedType<G extends Guard<unknown>> =
  G extends Guard<infer T> ? T : never;

function pathToString(path: (string | number)[]): string {
  if (path.length === 0) return ".";
  const parts: string[] = [];
  for (const p of path) {
    if (typeof p === "number") {
      parts.push(`[${p}]`);
    } else {
      parts.push(`.${p}`);
    }
  }
  return parts.join("");
}

export type Guard<T> = (v: unknown) => v is T;

export type JSONPrimitive = null | string | number | boolean;

export type GuardedType<G extends Guard<unknown>> =
  G extends Guard<infer T> ? T : never;

export type Guard<T> = (v: any) => v is T;

export type JSONPrimitive = null | string | number | boolean;

export type GuardedType<G extends Guard<unknown>> = G extends Guard<infer T>
  ? T
  : never;

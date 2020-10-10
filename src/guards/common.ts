export type Guard<T> = (v: any) => v is T;

export type JSONPrimitive = null | string | number | boolean;

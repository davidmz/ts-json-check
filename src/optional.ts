type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type RequiredKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];

type WithOptional<T> = {
  [K in OptionalKeys<T>]?: T[K];
};

type WithRequired<T> = {
  [K in RequiredKeys<T>]: T[K];
};

export type UndefinedAsOptional<T> = WithOptional<T> & WithRequired<T>;

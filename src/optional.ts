/**
 * Utility type to make object types more readable by flattening nested objects
 * and making properties explicit.
 */
type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Type to extract keys that have undefined as part of their type union. For
 * example, in { a?: string | undefined }, 'a' will be included.
 */
type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Type to extract keys that do NOT have undefined as part of their type union.
 * For example, in { a: string }, 'a' will be included.
 */
type RequiredKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];

/**
 * Type to create an object with only the optional keys from T, making them
 * optional.
 */
type WithOptional<T> = {
  [K in OptionalKeys<T>]?: T[K];
};

/**
 * Type to create an object with only the required keys from T, making them
 * required.
 */
type WithRequired<T> = {
  [K in RequiredKeys<T>]: T[K];
};

export type UndefinedAsOptional<T> = Prettify<
  WithOptional<T> & WithRequired<T>
>;

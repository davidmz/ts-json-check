# ts-json-check

This library is a simple JSON-data typechecker for TypeScript.
It will be useful when you have some arbitrary JSON-data
(for example, API response) and you need to check them and
cast them to the right type.

## Install

```
npm install ts-json-check
```

or

```
yarn add ts-json-check
```

## Usage

```typescript
import {
  isObject,
  isBoolean,
  isNumber,
  isString,
  isOneOf,
  // ...
} from "ts-json-check";

// ...

// You can't be sure that the data from the server is correct, so
// apiResponse has an 'unknown' type.
const apiResponse = getSomeData();

// Describe the desired shape of data using ts-json-check
// guard functions.
const isResponse = isObject({
  id: isOneOf(isNumber, isString),
  title: isString,
  archived: isBoolean,
});

// To extract the resulting type from the guard use the GuardedType utility
// type. The APIResponse here is:
// { id: number|string, title: string, archived: boolean }
type APIResponse = GuardedType<typeof isResponse>;

if (isResponse(apiResponse)) {
  // The apiResponse have an APIResponse type here
} else {
  // apiResponse have a wrong type
}
```

When you need to know _where_ the data failed validation, wrap the guard with `checker()`:

```typescript
import { checker } from "ts-json-check";

const chkResponse = checker(isResponse);

if (chkResponse(apiResponse)) {
  // apiResponse is APIResponse here
} else {
  console.error(chkResponse.error?.path); // e.g. ".title"
  console.error(chkResponse.error?.message); // e.g. "isString() failed"
}
```

## API

This library is intended only for JSON processing, so it does not attempt
to simulate all the types available in TypeScript.

### Primitive guards

The following guards correspond to the primitive JSON types:

- **isNull**
- **isNumber**
- **isString**
- **isBoolean**

**isUndefined** is also available, but `undefined` is not a valid JSON value — use it only
when working with non-JSON data structures.

### Constant guard

There is one guard that checks that the argument is a constant value (or any of constant values) of
primitive JSON type: **isConst**.

Use it as: `isConst(42)` or as `isConst(42, 43)`

It is useful when your data can have different shape depending on value of some field
(the _discriminant_ in TS terms).

The multi-argument form of this guard (`isConst(42, 43)`) is equivalent to the following isAnyOf
form: `isAnyOf(isConst(42), isConst(43))`.

### 'Any' and 'Unknown' guards

There is **isAny** and **isUnknown** guards that are always returns _true_ and keeps it argument
as _any_ or _unknown_ respectively. They are useful when you don't know the exact type of your
data yet and want to keep some fields untyped.

### Composite guards

The composite JSON types are expressed by the following functions:

**isObject**

JSON object: `{ "foo": 42, "bar": "baz" }`

Use it as: `isObject({ foo: isNumber, bar: isString})`. You can use any guards
as the values of the argument object. The input data object can have additional
keys, it is not an error.

You can control the extra keys behavior with the `extraKeys` option. Use it as:
`isObject({ foo: isNumber }, { extraKeys: false })`. `extraKeys: false` rejects extra keys.

**isArray**

An array of values of the same type: `[1, 2, 3, 4]`

Use it as: `isArray(isNumber)`. You can constrain the array length with the `minLength` and `maxLength` options:
`isArray(isNumber, { minLength: 1, maxLength: 10 })`

**isTuple**

An array of values of different types: `[42, "baz"]`. In TypeScript
this corresponds to tuples.

Use it as: `isTuple(isNumber, isString)`

The length of the input data array must be equal to the count
of the isTuple arguments. The argument list may not be empty.

### Utility checkers

**isOneOf**

Checks that value have one of the given types.

Use it as: `isOneOf(isNumber, isString)`

The resulting type will be `number | string`.
The isOneOf accepts two or more checkers as arguments.

> **isAnyOf** is a deprecated alias for `isOneOf`. Prefer `isOneOf` in new code.

**isAllOf**

Checks that value have all of the given types.

Use it as: `isAllOf(isNumber, (x) => x > 0)`

The resulting type will be `number`, but the value must pass both checks.
The isAllOf accepts two or more checkers as arguments.

**isOptional**

Marks object field as optional.

Use it as: `isObject({ id: isNumber, title: isOptional(isString) })`

The resulting type will be `{ id: number, title?: string | undefined }`.

### Error reporting

**checker**

Wraps any guard into a `CheckerGuard<T>`. A `CheckerGuard` is still a regular type guard —
`if (chk(x))` narrows `x` to `T` — but after each call it also exposes an `error` property:

- `chk.error` is `null` on success
- `chk.error` is a `CheckError` on failure, with:
  - `path: string` — dot-separated path to the failing field (e.g. `".users[0].email"`)
  - `message: string` — description of the failure (e.g. `"isString() failed"`)

`CheckError` extends `Error`, so it can be thrown or passed to error-handling utilities.

### Custom guards

Although this is not usually necessary, you can create your own guard functions.
The type is simple: `Guard<T> = (v: unknown, ctx?: Context) => v is T`. Guard function should check
argument and return _true_ if it has the correct type of _false_ otherwise (see
[the TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)).

For example let's create guard for positive numbers:

```typescript
import { isNumber } from "ts-json-check";

function isPositiveNumber(v: unknown): v is number {
  return isNumber(v) && v > 0;
}
```

Note that the guarded type of _isPositiveNumber_ is still a _number_. TypeScript
hasn't a special type for the positive numbers.

Simple custom guards like the one above don't need to handle the `context` parameter —
when used with `checker()`, it will fall back to a generic error message pointing at the
guard's function name.

> **Note:** In production builds, function names are typically minified (e.g. `isPositiveNumber`
> becomes `a`), making error messages like `a() failed` useless. Use `named()` to assign a
> stable display name to any guard:
>
> ```typescript
> import { named } from "ts-json-check";
>
> const isPositiveNumber = named(
>   "isPositiveNumber",
>   (v: unknown): v is number => typeof v === "number" && v > 0,
> );
> // error message will always be "isPositiveNumber() failed"
> ```
>
> Alternatively, you can set the `displayName` property directly:
>
> ```typescript
> const isPositiveNumber = (v: unknown): v is number =>
>   typeof v === "number" && v > 0;
> isPositiveNumber.displayName = "isPositiveNumber";
> ```
>
> `named()` only helps for "leaf" guards that don't set `ctx.error` themselves.

However, if you write a complex custom guard with internal branching, you should populate
the context yourself so that `checker()` can report a precise error path:

```typescript
import { isNumber, isString, isObject } from "ts-json-check";
import type { Guard, Context } from "ts-json-check";

function isEmail(v: unknown, ctx?: Context): v is string {
  if (!isString(v)) {
    if (ctx) ctx.error = new CheckError(ctx.path, "expected an email string");
    return false;
  }
  if (!v.includes("@")) {
    if (ctx) ctx.error = new CheckError(ctx.path, "not a valid email");
    return false;
  }
  return true;
}
```

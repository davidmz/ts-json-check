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
  isAnyOf,
  // ...
} from "ts-json-check";

// ...

// You can't be sure that the data from the server is correct, so
// apiResponse has an 'any' type.
const apiResponse = getSomeData();

// Describe the desired shape of data using ts-json-check
// guard functions.
const isResponse = isObject({
  id: isAnyOf(isNumber, isString),
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

## API

This library is intended only for JSON processing, so it does not attempt
to simulate all the types available in TypeScript.

### Primitive guards

The following guards are corresponds to the primitive JSON types:

- **isNull**
- **isNumber**
- **isString**
- **isBoolean**

### Constant guard

There is one guard that checks that the argument is a constant value (or any of constant values) of
primitive JSON type: **isConst**.

Use it as: `isConst(42)` or as `isConst(42, 43)`

It is useful when your data can have different shape depending on value of some field
(the _discriminant_ in TS terms).

The multi-argument form of this guard (`isConst(42, 43)`) is equivalent to the following isAnyOf
form: `isAnyOf(isConst(42), isConst(43))`.

### 'Any' guard

There is **isAny** guard that is always returns _true_ and keeps it argument as _any_. It is useful
when you don't know the exact type of your data yet and want to keep some fields untyped.

### Composite guards

The composite JSON types are expressed by the following functions:

**isObject**

JSON object: `{ "foo": 42, "bar": "baz" }`

Use it as: `isObject({ foo: isNumber, bar: isString})`. You can use any guards
as the values of the argument object. The input data object can have additional
keys, it is not an error.

**isArray**

An array of values of the same type: `[1, 2, 3, 4]`

Use it as: `isArray(isNumber)`

**isTuple**

An array of values of different types: `[42, "baz"]`. In TypeScript
this corresponds to tuples.

Use it as: `isTuple(isNumber, isString)`

The length of the input data array must be equal to the count
of the isTuple arguments. The argument list may not be empty.

### Utility checkers

**isAnyOf**

Checks that value have one of the given types.

Use it as: `isAnyOf(isNumber, isString)`

The resulting type will be `number | string`.
The isAnyOf accepts two or more checkers as arguments.

**isOptional**

Marks object field as optional.

Use it as: `isObject({ id: isNumber, title: isOptional(isString) })`

The resulting type will be `{ id: number, title?: string | undefined }`.

### Custom guards

Although this is not usually necessary, you can create your own guard functions.
The type is simple: `Guard<T> = (v: any) => v is T`. Guard function should check
argument and return _true_ if it has the correct type of _false_ otherwise (see
[the TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)).

For example let's create guard for positive numbers:

```typescript
import { isNumber } from "ts-json-check";

function isPositiveNumber(v: any): v is number {
  return isNumber(v) && v > 0;
}
```
Note that the guarded type of _isPositiveNumber_ is still a _number_. TypeScript
hasn't a special type for the positive numbers.

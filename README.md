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
  TypeOf,
} from "ts-json-check";

// ...

// You can't be sure that the data from the server is correct, so
// apiResponse has an 'any' type.
const apiResponse = getSomeData();

// Describe the desired shape of data using ts-json-check
// checker functions.
const check = isObject({
  id: isAnyOf(isNumber, isString),
  title: isString,
  archived: isBoolean,
});

// To extract the resulting type from the checker function just use
// TypeScript's standard ReturnType. The RespType here is:
// { id: number|string, title: string, archived: boolean }
type RespType = ReturnType<typeof check>;

try {
  // Check the data and assign the desired type. Here typedResponse
  // is the apiResponse (typedResponse === apiResponse) but now it
  // has a RespType type.
  const typedResponse = check(apiResponse);
} catch (e) {
  // apiResponse have a wrong type
}
```

## API

This library is intended only for JSON processing, so it does not attempt
to simulate all the types available in TypeScript.

### Primitive checkers

The following checker functions ("checkers") are corresponds to the
primitive JSON types:

- **isNull**
- **isNumber**
- **isString**
- **isBoolean**

### Composite checkers

The composite JSON types are expressed by the following functions:

**isObject**

JSON object: `{ "foo": 42, "bar": "baz" }`

Use it as: `isObject({ foo: isNumber, bar: isString})`. You can use any
checkers as the values of the argument object. The input data object can
have additional keys, it is not an error.

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

The resulting type will be `{ id: number, title?: string }`.

### Custom checkers

Although this is not usually necessary, you can create your own checker functions.
The type is simple: `Checker<T> = (v: any) => T`. Checker function should check
argument and return it without changes with desired type. In case of error function
should throw Error.

For example let's create checker for positive numbers:

```typescript
import { isNumber } from "ts-json-check";

function isPositiveNumber(v: any): number {
  // Ensure that v is a number
  const num = isNumber(v);
  if (num <= 0) {
    throw new Error(`${num} is not positive number`);
  }
  return num;
}
```

# Changelog

## [2.5.0] - 2026-04-06

### Added

- `isUndefined` guard is exported: checks that a value is `undefined`. Not a
  JSON type, but available for non-JSON use cases.
- `JSONPrimitive` type is now exported: `null | string | number | boolean`.
  Useful when working with `isConst`.
- `UndefinedAsOptional<T>` type is now exported: a utility type that converts
  properties with `undefined` in their type to optional properties. This is the
  type produced by `isObject` guards.

### Changed

- `UndefinedAsOptional<T>` now produces a flattened object type instead of an
  intersection (`WithOptional<T> & WithRequired<T>`), so IDE tooltips show a
  clean `{ id: string; username?: string }` instead of the raw intersection.
- `isAllOf` now correctly infers an intersection type (`A & B`) instead of a
  union type (`A | B`).

### Fixed

- `isAny` and `isUnknown` now correctly return `true` for `NaN`. Previously
  they used `v === v` which evaluates to `false` for `NaN`.

## [2.4.0] - 2026-10-14

### Fixed

- The package publish process was broken in 2.1.0 due to incorrect publish
  configuration.

## [2.3.0] - 2026-04-05

### Added

- `isOneOf` function: checks if a value matches any of the provided guards. It
  replaces the deprecated `isAnyOf` function.
- `isAllOf` function: checks if a value matches all of the provided guards.

### Changed

- `isObject` now accepts an optional second argument `{ extraKeys: false }` to
  reject objects that contain keys not present in the shape. By default extra
  keys are still allowed.
- `isArray` now accepts an optional second argument `{ minLength, maxLength }`
  to constrain the array length.

### Deprecated

- `isAnyOf` function: use `isOneOf` instead.

### Fixed

- `checker()` now forwards the outer context when used as a nested guard inside
  complex structures like `isObject`. This means user can use `CheckerGuard` in
  nested structures in the same way as `Guard`, and it will correctly report the
  full nested path (e.g. `.address.street`).

## [2.2.0] - 2026-04-04

### Added

- `CheckError` class: `CheckError extends Error` with `path: string` and
  `message: string` fields. The `path` reflects where in the data structure
  validation failed (e.g. `.user.address.zip`).
- `checker()` function: wraps any `Guard<T>` into a `CheckerGuard<T>` — a type
  guard that also exposes a `error: CheckError | null` property after each call.
  Type narrowing works as usual (`if (chk(x)) { /* x is T */ }`), and on failure
  `chk.error` contains the path and reason.
- Context-aware validation in `isObject`, `isArray`, `isTuple`, `isAnyOf`, and
  `isOptional`: when called via `checker()`, these now populate the error path
  automatically.

## [2.1.0] - 2026-04-04

### Changed

- **Build output restructured**: the build now produces `build/index.cjs` and
  `build/index.mjs` instead of `build/cjs/index.js` and `build/esm/index.js`.
  Consumers importing via `main`/`exports` (the standard way) are not affected.
  The generated `build/package.json` now includes an `exports` field with
  explicit `require`/`import` conditions.
- Migrated from custom `tsc`-based build scripts to
  [`@davidmz/ts-lib-build`](https://github.com/davidmz/ts-lib-build).
- Migrated from Jest to the Node.js native test runner (`node --test`).
- Migrated from Prettier/TSLint to [oxfmt](https://github.com/oxc-project/oxfmt)
  and [oxlint](https://oxc.rs/docs/guide/usage/linter).
- Updated TypeScript to v6, all other dependencies to latest versions.
- Migrated from Yarn to pnpm.

## [2.0.3] - 2022-02-07

_Initial public release._

# Changelog

## [2.2.0] - 2026-04-04

### Added

- **`CheckError` class**: `CheckError extends Error` with `path: string` and `message: string` fields. The `path` reflects where in the data structure validation failed (e.g. `.user.address.zip`).
- **`checker()` function**: wraps any `Guard<T>` into a `CheckerGuard<T>` — a type guard that also exposes a `error: CheckError | null` property after each call. Type narrowing works as usual (`if (chk(x)) { /* x is T */ }`), and on failure `chk.error` contains the path and reason.
- **Context-aware validation** in `isObject`, `isArray`, `isTuple`, `isAnyOf`, and `isOptional`: when called via `checker()`, these now populate the error path automatically.

## [2.1.0] - 2026-04-04

### Changed

- **Build output restructured**: the build now produces `build/index.cjs` and `build/index.mjs` instead of `build/cjs/index.js` and `build/esm/index.js`. Consumers importing via `main`/`exports` (the standard way) are not affected. The generated `build/package.json` now includes an `exports` field with explicit `require`/`import` conditions.
- Migrated from custom `tsc`-based build scripts to [`@davidmz/ts-lib-build`](https://github.com/davidmz/ts-lib-build).
- Migrated from Jest to the Node.js native test runner (`node --test`).
- Migrated from Prettier/TSLint to [oxfmt](https://github.com/oxc-project/oxfmt) and [oxlint](https://oxc.rs/docs/guide/usage/linter).
- Updated TypeScript to v6, all other dependencies to latest versions.
- Migrated from Yarn to pnpm.

## [2.0.3] - 2022-02-07

_Initial public release._

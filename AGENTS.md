# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Commands

```bash
pnpm test                  # run all tests
pnpm run build             # build to ./build/
pnpm run lint              # oxlint
pnpm run format            # oxfmt (format in place)
pnpm run format:check      # oxfmt --check
```

To run a single test file:

```bash
node --test src/primitive.test.ts
```

## Architecture

This is a small TypeScript library that provides runtime type-guard functions for JSON data. All source is in `src/`.

**Module structure:**

- `common.ts` — shared types only (`Guard<T>`, `GuardedType`, `JSONPrimitive`). No runtime code.
- `primitive.ts` — guards for primitive types (`isNull`, `isNumber`, `isString`, `isBoolean`, `isConst`, `isAny`).
- `optional.ts` — `UndefinedAsOptional<T>` utility type only. No runtime code.
- `complex.ts` — composite guards (`isArray`, `isTuple`, `isObject`). `isObject` uses `UndefinedAsOptional` to make fields with `T | undefined` type optional in the inferred TypeScript type.
- `utility.ts` — `isAnyOf` (union guard, requires ≥2 arguments) and `isOptional` (wraps a guard to also accept `undefined`).
- `index.ts` — public re-exports.

**Tests** (`*.test.ts`) are type-level only — they use `assert<IsExact<...>>(true/false)` from `conditional-type-checks` to verify TypeScript narrows types correctly. There are no runtime assertions. Tests use Node.js native test runner (`node:test`).

**Build** is handled by `@davidmz/ts-lib-build` which produces `build/index.cjs`, `build/index.mjs`, and a `build/package.json` with `exports` field — consumers use that `package.json`, not the root one.

**Import conventions:** all relative imports use explicit `.ts` extensions (required for ESM + Node's type stripping). Type-only imports use `import type`.

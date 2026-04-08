---
description: 'Use when working with library publishing, package.json, ng-package.json, peer dependencies, or cross-library dependencies in the oilmod-web monorepo.'
applyTo: 'libs/**'
---

# Library Architecture — oilmod-web

## Publishable Modules

Each library under `libs/` is **independently publishable** to npm as `@ngx-stoui/{name}`.

```json
{
  "name": "@ngx-stoui/core",
  "version": "21.0.5",
  "peerDependencies": {
    "@angular/core": "^21.0.0"
  }
}
```

## Dependency Rules

Libraries follow a strict dependency hierarchy:

- `core` → Foundation (no internal dependencies)
- `common` → Depends on `core`
- `datatable`, `drawer`, `form`, `popover` → Depend on `core` and `common`
- **Never** create circular dependencies between libraries
- **Never** import from a sibling library that isn't in the dependency chain

## Peer Dependencies

- Peer dependencies **must match** the Angular major version (e.g. `@ngx-stoui/core@21.x` → `@angular/core@^21.0.0`).
- Angular Material versions must align with Angular core versions.
- Keep peer dependency ranges as wide as possible for consumer flexibility.

## Public API (index.ts)

Every component, service, model, or utility that consumers should access **must** be exported from the library's `src/index.ts`:

```typescript
// libs/core/src/index.ts
export * from './lib/my-component/my-component.component';
export * from './lib/my-service/my-service.service';
```

Do **not** export internal implementation details.

## ng-package.json

Each library has an `ng-package.json` for ng-packagr. Do not modify `dest` paths unless you understand the build pipeline.

## Deprecated NgModule Wrappers

Many libraries still export deprecated `NgModule` wrappers (e.g. `SlideToggleModule`, `StoDatatableModule`) for backward compatibility with legacy consumers. These are marked `@deprecated` in code.

- **Do NOT create new NgModules** — components are standalone.
- **Do NOT delete existing modules** without a major version bump.
- Deprecation removal happens at the next major version.

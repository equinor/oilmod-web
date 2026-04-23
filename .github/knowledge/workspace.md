---
domain: workspace
related: [theming, core, common, datatable, drawer, form, popover]
---

# Workspace — Mental Model

Nx 22 monorepo publishing 7 Angular libraries under `@ngx-stoui/*`. Bun package manager, Vitest tests, release-please releases, yalc for local dev. Single Storybook app at `apps/oilmod-web` hosts all stories.

## nx-config

- OWNS: target defaults, caching, generator defaults — `nx.json`
- OWNS: TS path aliases `@ngx-stoui/{lib}` → `libs/{lib}/src/index.ts` — `tsconfig.base.json`
- INVARIANT: `targetDefaults.build.dependsOn = ["^build"]` so libs build their deps first
- INVARIANT: every lib has single entry point at `libs/{lib}/src/index.ts`
- INVARIANT: build/test/lint/build-storybook/e2e all marked `cache: true`
- TENSION: `nx.json` generator defaults still set `unitTestRunner: "jest"` and a `@nx/jest:jest` targetDefault, but every project actually uses `@nx/vitest:test` with `vitest.config.mts` — generated libs need manual migration
- DECIDED: one entry point per lib (no secondary entry points); cross-lib imports must go through the public `index.ts`

## dependency-graph

- INVARIANT: `core` has no internal lib deps; `common` depends on `core`; `datatable`, `drawer`, `form`, `popover`, `error-handler` depend on `core` (+ `common` where used)
- INVARIANT: every published lib lists `@angular/core ^21.0.0` and `@angular/common ^21.0.0` as peerDeps (`libs/{lib}/package.json`)
- INVARIANT: `core` additionally requires `date-fns ^4.1.0` as peerDep (used by [date-format.pipe.ts](libs/core/src/lib/sto-pipes/date-format.pipe.ts))
- INVARIANT: each published lib depends on `tslib` only (runtime)
- DECIDED: peerDeps are pinned to a single major (`^21.0.0`); never widen the range without explicit decision — consumers expect lock-step Angular versions

## library-build

- OWNS: ng-packagr build config — `libs/{lib}/ng-package.json` outputs to `dist/libs/{lib}` with `entryFile: src/index.ts`
- OWNS: build executor `@nx/angular:package` for all libs except `core`
- INVARIANT: `core` has split targets — `build-lib` runs ng-packagr, `build` then runs `tools/scripts/build-scss.ts` + `tools/scripts/copy-assets.ts` to compile and copy 3 CSS bundles into `dist/libs/core`
- INVARIANT: `core/package.json` `exports` field publishes `./ngx-stoui.css`, `./ngx-datatable.css`, `./toolbox-grid.css` alongside the JS entry; other libs only publish `./index.js`
- TENSION: the `core` build is a special case (only lib with custom scripts) — increases cognitive load; future contributors must remember the SCSS step
- DECIDED: CSS lives only in `core` (single source of truth); other libs ship JS only and rely on consumers importing core's CSS
- FLOW[scss]: edit `libs/core/src/styles/**.scss` → `tools/scripts/build-scss.ts` watches with 100 ms debounce → recompile via `sass.compileAsync()` → write to `dist/libs/core/*.css` → `link:watch` pushes via yalc

## release-please

- OWNS: per-lib semantic versioning, CHANGELOG generation, GitHub release tags — `release-please-config.json`
- INVARIANT: 7 packages registered (core, common, datatable, drawer, error-handler, form, popover); `testing` is intentionally absent
- INVARIANT: `separate-pull-requests: false` — one combined release PR covering all changed libs per cycle
- INVARIANT: tag format = `{component}-{version}` (e.g. `core-21.0.7`), `include-v-in-tag: false`
- INVARIANT: commit `type(scope): message` drives versioning; `feat` = minor, `fix`/`perf` = patch, `!` after scope = major
- INVARIANT: `scope` MUST be a published lib name (or comma-separated list) for the change to land in that lib's CHANGELOG; out-of-lib changes use `chore`/`ci`/`docs`/`build` without scope
- TENSION: `testing` lib has its own `package.json` and version but no release-please entry — unclear whether it is published manually or only consumed in-tree; flag before publishing it
- DECIDED: combined release PR over per-lib PRs to reduce review overhead; trade-off is that one stuck lib delays all releases

## ci-cd

- OWNS: PR validation + release publishing — `.github/workflows/ci.yml`
- FLOW[validate]: PR or push to `master` → lint + test + build run in parallel → all must pass → release-please job triggered
- FLOW[release-merge]: if HEAD commit message starts with `chore(main|master): release` → CI skips lint/test/build and goes straight to publish (because release-please bot already validated upstream)
- INVARIANT: per-lib `publish_{lib}` workflow_dispatch inputs allow manual selective publish for hotfixes
- DECIDED: tests/lints run before release-please, not after — belt-and-suspenders; once a release PR is approved we trust it

## dev-loop

- OWNS: local dev orchestration — root `package.json` scripts
- FLOW[dev]: `bun run dev` → initial `nx run-many --target=build` → `link:push` (yalc publish-and-update each `dist/libs/*`) → `concurrently` runs `build:watch` + `link:watch`
- READS FROM: `link:watch` uses chokidar to watch `dist/libs/*/fesm2022/*.mjs` with 8 s debounce + polling; on change runs `link:push`
- INVARIANT: `bun run build` only builds the 7 publishable libs (`testing` excluded)
- INVARIANT: yalc — not `npm link` — is the supported local linking mechanism (avoids symlink issues with Angular peerDeps)
- TENSION: 8 s debounce on `link:watch` adds latency to consumer reload, but prevents thrashing during multi-file builds
- DECIDED: bun chosen over npm/yarn for speed; CI uses `oven-sh/setup-bun@v2`

## storybook

- OWNS: visual showcase + manual interactive testing — `apps/oilmod-web` (single Angular app)
- INVARIANT: stories live alongside source in `libs/**/src/lib/**/*.stories.ts` and are auto-discovered by the app's storybook config
- INVARIANT: per-lib `build-storybook` outputs to `dist/storybook/{lib}` so each can be deployed independently if needed
- INVARIANT: only one Storybook may serve at a time — port 4400 shared
- DECIDED: single Storybook host (not one per lib) to keep consumer-facing docs unified

## e2e

- OWNS: end-to-end tests against the Storybook host — `apps/oilmod-web-e2e/` (Cypress)
- INVARIANT: `implicitDependencies: ["oilmod-web"]` so `nx affected` picks it up when the host changes
- READS FROM: cypress hits `oilmod-web:serve:development`

## error-handler-lib

- OWNS: ErrorHandler component + `wrapper.ts` utility — `libs/error-handler/src/lib/`
- OWNS: published as `@ngx-stoui/error-handler`, currently v21.1.1
- INVARIANT: included in release-please; standard build pipeline (no custom scripts)
- (See lib's own README for component contract; small enough to skip a dedicated knowledge file)

## testing-lib

- OWNS: `material.module.ts` shared Material module for consumer tests — `libs/testing/src/lib/`
- OWNS: published as `@ngx-stoui/testing` v21.0.1 — but **not** managed by release-please
- TENSION: `testing` has package metadata but no release automation — provenance of past published versions is unclear; do not bump version casually until publishing path is decided
- DECIDED: kept out of `bun run build` and out of release-please; treat as internal until a publishing decision is documented

## tooling

- OWNS: SCSS compilation — `tools/scripts/build-scss.ts` (3 hardcoded inputs in `libs/core/src/`)
- OWNS: asset copy step for core build — `tools/scripts/copy-assets.ts`
- OWNS: AI-assisted migration scripts — `tools/ai-migrations/` (purpose not fully documented; treat as experimental)
- OWNS: ESLint config at root + per-lib (`eslint.config.mjs`)
- INVARIANT: `migrations.json` tracks pending Nx migrations (Vitest 4 prep, reportsDirectory prefix) — non-blocking but should be drained before next Nx upgrade

## commit-conventions

- INVARIANT: commits MUST follow `type(scope): message` (Conventional Commits) because release-please parses them
- INVARIANT: `scope` is a published lib name from `libs/` (or comma-separated for multi-lib changes); workflows/tooling use `chore`/`ci`/`build`/`docs` without scope
- DECIDED: keep commits small and per-lib — multi-lib commits land in multiple CHANGELOGs at once which can confuse release notes

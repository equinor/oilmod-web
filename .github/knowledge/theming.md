---
domain: theming
related: [core, workspace]
---

# Theming — Mental Model

EDS (Equinor Design System) tokens layered onto Angular Material 3 via system-variable mapping. Single SCSS entry orchestrates tokens → M3 theme → component overrides. Dark mode via CSS `light-dark()`. Accessibility scaling via three body classes that retune `--sto-base-font-size`. All theming files live in [libs/core/src/styles/](libs/core/src/styles/).

## entry-orchestrator

- OWNS: import + execution order — [libs/core/src/styles/index.scss](libs/core/src/styles/index.scss)
- FLOW: `@forward` everything for downstream `@use`, then `@use` + execute mixins in order — `material-theme.apply-material-theme()` → `components.apply-component-styles()` → `form.form-theme()` → `datatable.apply-datatable-styles()`
- INVARIANT: order matters — tokens must define CSS custom properties before M3 mixins reference them; component styles depend on M3 system variables being populated
- INVARIANT: consumers integrate via `@use '@ngx-stoui/core/styles' as core;` (SCSS) **or** via published CSS file `@ngx-stoui/core/ngx-stoui.css` (compiled by `tools/scripts/build-scss.ts` for non-SCSS apps)

## tokens

- OWNS: EDS color/space token definitions on `:root` — [libs/core/src/styles/\_tokens.scss](libs/core/src/styles/_tokens.scss)
- OWNS: ~40 CSS custom properties: `--eds-foreground-*`, `--eds-background-*`, `--primary-*` (teal `#007079`), `--warning-*`, `--success-*`, `--danger-*`, semantic aliases (`--text`, `--text-secondary`, `--bg-default`, `--bg-card`, `--divider`, etc.)
- INVARIANT: every token defined as `light-dark(lightValue, darkValue)` so dark mode is automatic when `color-scheme: dark` is active
- INVARIANT: `--eds-background-info` is intentionally identical in both schemes (light blue `#d5eaf4`) — accessibility contrast decision; do not "fix" the duplication
- INVARIANT: `--warning-resting`, `--success-resting`, `--danger-resting` are constant across themes (status colors must remain recognisable)
- DECIDED: tokens are the single source of truth — Material adapts to EDS, not vice versa
- TENSION: CSS `light-dark()` requires Color Level 5 support — older browsers degrade to first arg (light); no polyfill shipped

## material-theme

- OWNS: M3 theme definition + system-variable bridge — [libs/core/src/styles/\_material-theme.scss](libs/core/src/styles/_material-theme.scss)
- INVARIANT: theme defined as `mat.define-theme((color: (theme-type: light, use-system-variables: true), typography: (use-system-variables: true), density: (scale: 0)))`
- INVARIANT: `use-system-variables: true` is the linchpin — it makes M3 components resolve their tokens from CSS custom properties at runtime, which lets EDS tokens override M3 defaults without recompiling
- INVARIANT: M3 `--mat-sys-*` color/shape variables are remapped to EDS tokens (e.g. `--mat-sys-primary: var(--primary-resting)`, `--mat-sys-surface: var(--bg-card)`, `--mat-sys-error: var(--danger-resting)`)
- INVARIANT: M3 corner shapes overridden — `--mat-sys-corner-small/medium: 4px`, `--mat-sys-corner-large: 8px` (M3 default `9999px` pill radii are rejected)
- INVARIANT: `--application-font: Equinor, Roboto, sans-serif` — Equinor primary, Roboto fallback, sans-serif last resort
- DECIDED: EDS shape wins over M3 default rounding — Equinor brand identity > M3 visual defaults
- TENSION: M3 + EDS coexistence is fragile — every Material upgrade can introduce new `--mat-sys-*` variables that aren't yet remapped to EDS tokens; budget time to audit after each Material version bump

## typography-scaling

- OWNS: three accessibility scales as body classes — `.sto-sm-typography` (10 px), `.sto-m-typography` (13 px default Equinor), `.sto-l-typography` (16 px) — defined in [\_material-theme.scss](libs/core/src/styles/_material-theme.scss)
- OWNS: `--sto-base-font-size` anchor variable; all typography sizes scale from it via `calc()`
- INVARIANT: `--mat-form-field-container-height: calc(var(--sto-base-font-size) * 3.23)` → 32 / 42 / 52 px for sm/m/l
- INVARIANT: form-field `--mat-form-field-*-text-size` tokens are explicitly reset to `initial` so Material falls through to `--mat-sys-*` system variables — without this reset, component tokens are resolved once and never react to scale changes
- INVARIANT: scale class MUST be applied to `<body>` (or `:root`) so descendants inherit the rescaled `--sto-base-font-size`
- DECIDED: 13 px Equinor base font is the locked default; sm/l are accessibility opt-ins (typically driven by `StoThemeService` user preference — see [common.md](common.md))

## toolbox-grid-compact

- OWNS: `.eds-compact` density block for `@toolbox-web/grid` — [libs/core/src/styles/toolbox-grid/\_toolbox-grid.scss](libs/core/src/styles/toolbox-grid/_toolbox-grid.scss) (published as `@ngx-stoui/core/toolbox-grid.css`)
- INVARIANT: compact metrics scale from `--sto-base-font-size` so they honour the sm/m/l typography classes. Ratios off the 13px Regular base: font `× 0.846` (→11px), row `× 1.154` (→15px), header `× 1.538` (→20px). At sm(10px)→8/12px, l(16px)→14/18px.
- INVARIANT: the row/header heights MUST be whole px. A `.cell`'s intrinsic content height is `≈ line-height + ~3.5px`; the rendered row is `max(--tbw-row-height, that floor)`. A fractional value renders sub-pixel rows, so the 1px row dividers land on fractional device rows and **drop out inconsistently** (the old `calc(13px * 1.111) ≈ 14.44px` did exactly this). Lowering only the font does NOT fix it — the height must be integer.
- DECIDED: heights use the native CSS `round(<proportional>, 1px)` function, NOT a Sass round or a hard-coded px. Because the arg holds `var(--sto-base-font-size)`, Sass can't fold it at build time — it emits `calc(round(...))` and the browser evaluates it at **runtime**, so switching typography class restyles the grid live (verified: sm/m/l → 12/15/18px rows, all integer & crisp). Requires Dart Sass ≥1.65 (repo is on 1.100) + a browser with CSS `round()` (Chrome 112 / Safari 15.4 / Firefox 118).
- GOTCHA: prefer native CSS sizing functions (`calc`/`round`/`clamp`/`min`/`max`) over Sass math here so values react to runtime `var()` changes; a Sass-computed px would freeze at build time and ignore the accessibility scale.

- TENSION: any ad-hoc `font-size` override outside the three scale classes breaks form-field proportions because heights depend on the calc chain

## overrides

- OWNS: base HTML element styles + Material component fixes — [libs/core/src/styles/\_overrides.scss](libs/core/src/styles/_overrides.scss)
- WRITES TO: `html`, `body`, headings (`h1`–`h6` rescaled from `--sto-base-font-size`), input spinner removal, scrollbar color, progress bar colors, select panel padding
- INVARIANT: `* { box-sizing: border-box; }` is global — assumed by all component widths
- INVARIANT: `body.mat-app-background` sets `scrollbar-color: var(--primary-resting) var(--bg-card)` — Material `mat-app-background` class must be present on `<body>` for app-wide chrome to render correctly

## dark-mode

- OWNS: dark-mode activation via `.sto-dark-theme` class on `:root` — [\_tokens.scss](libs/core/src/styles/_tokens.scss)
- FLOW: `:root:has(.sto-dark-theme) { color-scheme: dark; }` toggles `light-dark()` to second arg → all tokens swap atomically
- INVARIANT: `StoThemeService` (in `@ngx-stoui/common`) is the canonical class manager — see `theme/` section in [common.md](common.md); ad-hoc `classList.toggle` calls outside that service will be detected and reconciled by the service's `MutationObserver`
- DECIDED: `light-dark()` over duplicated dark mixins → minimal SCSS, browser-native preference detection

## component-styles

- OWNS: per-component theming overrides — [libs/core/src/styles/components/](libs/core/src/styles/components/) (`_action-footer.scss`, `_appheader.scss`, `_datatable.scss`, `_dialog.scss`, `_drawer.scss`, `_filterpanel.scss`, `_input-overrides.scss`, `_message-panel.scss`, `_number-input.scss`, `_number-unit-input.scss`, `_preference-manager.scss`, `_select-filter.scss`, `_status-indicators.scss`, `_wysiwyg.scss`, `_daterange.scss`)
- INVARIANT: a new component lib that needs custom Material theming should add its overrides here (in core), not in the consuming lib — keeps theming centralized so consumers can opt in to one CSS bundle

## cdk-overlay

- OWNS: explicit theming for CDK overlay container (where `mat-select`, `mat-autocomplete`, datepicker panels render) — block in [\_material-theme.scss](libs/core/src/styles/_material-theme.scss)
- INVARIANT: `.cdk-overlay-container` lives at `document.body` level, OUTSIDE Angular component trees — its tokens must be set globally or overlays render with raw Material defaults
- TENSION: any new floating Material component (autocomplete, snackbar, etc.) may need additional `.cdk-overlay-container` rules

## fonts

- OWNS: `@font-face` declarations + Equinor woff/woff2 assets — [libs/core/src/styles/fonts/](libs/core/src/styles/fonts/)
- INVARIANT: Equinor font files (Bold, Light, Medium, Regular) shipped as woff + woff2; legacy Statoil Sans Medium retained
- INVARIANT: assets are copied to `dist/libs/core/` by `tools/scripts/copy-assets.ts` during the core build

## css-bundles

- OWNS: prebuilt CSS bundles for non-SCSS consumers — produced by `tools/scripts/build-scss.ts`
- INVARIANT: `core/package.json` `exports` field publishes 3 CSS files: `./ngx-stoui.css` (full theme), `./ngx-datatable.css` (datatable-only overrides), `./toolbox-grid.css` (grid utility)
- DECIDED: split into 3 bundles so apps not using the datatable don't pay for its overrides

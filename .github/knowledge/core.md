---
domain: core
related: [theming, common, workspace]
---

# @ngx-stoui/core — Mental Model

Foundation lib: standalone directives + pipes + the EDS/M3 theming system. No internal lib dependencies. Public TS API at [libs/core/src/index.ts](libs/core/src/index.ts) (directives, pipes, `Key` enum). Theming is consumed via SCSS imports, not TS imports. See [theming.md](theming.md) for the styling subsystem in depth.

## key-enum

- OWNS: keyboard key code constants used by directives — `libs/core/src/lib/abstract-and-interfaces/keyPress.enum.ts`
- INVARIANT: values are numeric `KeyboardEvent.keyCode` integers (not `.code` strings)
- TENSION: `KeyboardEvent.keyCode` is deprecated; not migrated to `KeyboardEvent.code` because consumers depend on the existing enum surface

## quick-keys-directive

- OWNS: `quickSubmit` (Ctrl+Enter) + `quickCancel` (Escape) outputs — [libs/core/src/lib/sto-directives/quick-keys.directive.ts](libs/core/src/lib/sto-directives/quick-keys.directive.ts)
- READS FROM: optional `formGroup` input to gate submit on dirty state; host keyup events
- INVARIANT: Escape always cancels regardless of form state; Ctrl+Enter only submits if `formGroup` is missing or dirty
- TENSION: `quickKeys` input is unused — kept for backward compat
- DECIDED: standalone (legacy NgModule wrapper retained in `directives.module.ts`)

## sto-select-text-on-focus-directive

- OWNS: auto-select text on focus / dblclick for `<input>` — [sto-select-text-on-focus.directive.ts](libs/core/src/lib/sto-directives/sto-select-text-on-focus.directive.ts)
- INVARIANT: never selects on `readOnly` inputs

## sto-grid-directives

- OWNS: responsive CSS Grid layout — `StoGridDirective` + `StoGridColumnDirective` + `StoGridSpacerDirective` ([sto-grid.directive.ts](libs/core/src/lib/sto-directives/sto-grid.directive.ts))
- READS FROM: SCSS in [\_utilities.scss](libs/core/src/styles/_utilities.scss) (`.sto-grid`, `.sto-grid--1`..`--12`, `.sto-grid__col`, `.sto-grid__col--2`, `.sto-grid__col--spacer`)
- INVARIANT: default auto-fit `minmax(200px, 1fr)`; modifier classes `.sto-grid--N` switch to fixed N-column
- TENSION: legacy alias `.sto-f-grid` extends `.sto-grid` for backward compat — do not introduce new uses

## date-form-field-click-directive

- OWNS: clicking anywhere on a `mat-form-field` opens its `MatDatepicker` and restores focus — [date-form-field-click.directive.ts](libs/core/src/lib/sto-directives/date-form-field-click.directive.ts)
- READS FROM: `@ContentChildren(MatInput)`; required input `stoDateFormFieldClick: MatDatepicker<Date>`
- TENSION: tightly coupled to Angular Material structure (mat-form-field + mat-input + datepicker)

## context-menu-directives

- OWNS: right-click context-menu orchestration — `ContextMenuDirective` + `MenuOverlayDirective` ([context-menu.directive.ts](libs/core/src/lib/sto-directives/context-menu.directive.ts), [menu-overlay.directive.ts](libs/core/src/lib/sto-directives/menu-overlay.directive.ts))
- READS FROM: `MatMenuTrigger` and `MenuOverlayDirective` references; `menuContext` arbitrary data
- WRITES TO: `MatMenuTrigger.menuData` before opening; `host.style.{position,left,top}` to anchor a 1×1 invisible trigger at cursor
- INVARIANT: `MenuOverlayDirective` must sit on the same element as `[matMenuTrigger]`
- INVARIANT: `event.preventDefault()` always called on contextmenu; menu toggles (closes if already open)
- FLOW: contextmenu → preventDefault → if open close → `overlayDirective.updatePosition(x,y)` → 150 ms timeout → `trigger.menuData = ctx; trigger.openMenu()`
- DECIDED: 150 ms delay lets overlay positioning settle before opening (avoid first-frame flicker)

## sto-pipes

- OWNS: 7 standalone presentation pipes in [libs/core/src/lib/sto-pipes/](libs/core/src/lib/sto-pipes/)
- INVARIANT: locale = Equinor/Scandinavian — space thousands separator, comma decimal — implemented by formatting via `Intl.NumberFormat('en-US')` then swapping `,`↔` ` and `.`→`,`
- INVARIANT: `CurrencyFormatPipe` returns `null` for falsy input (including `0`); see [currency-format.pipe.ts](libs/core/src/lib/sto-pipes/currency-format.pipe.ts)
- INVARIANT: `NumberFormatPipe` returns `''` for falsy, `null` for NaN; default `numberOfDecimals = 3`
- INVARIANT: `DateFormatPipe` uses `date-fns` `parseISO` + `isValid`; default format `'MMM d, yyyy'`; named formats: `long`, `short`, `datetime`, `datetimezone`, `datetime-long`, `datetime-short`
- INVARIANT: `YesNoPipe` second arg `ignoreNulls=true` returns `''` for null; default `false` returns `'No'`
- INVARIANT: `GetUnit`/`ExcludeUnit` parse `"value(unit)"` format by splitting on `(`
- DECIDED: locale conversion is done via string swap (not via a real `nb-NO` locale) so output is deterministic and unit-testable across environments
- TENSION: legacy `sto-pipes.module.ts` NgModule kept for backward compat — prefer direct imports

## styles-stories

- OWNS: button + dialog showcase — [libs/core/src/lib/styles.stories.ts](libs/core/src/lib/styles.stories.ts)
- INVARIANT: button color set covers `primary | accent | warn | warning | success | danger` — these are the six brand-recognised palettes; new colors require token + Material override

## public-api

- OWNS: TS public surface — [libs/core/src/index.ts](libs/core/src/index.ts) re-exports pipes, directives, and `Key` enum
- INVARIANT: theming is **not** exported via index.ts; consumers `@use '@ngx-stoui/core/styles'` (SCSS) or import the published CSS file
- DECIDED: keeping styles out of the TS surface lets consumers tree-shake the JS without dragging SCSS through their build

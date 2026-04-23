---
domain: common
related: [core, theming, datatable, drawer, form]
---

# @ngx-stoui/common — Mental Model

Cross-cutting application shell components: action footer, app header, breadcrumbs, confirm dialog, filter form base, message panel, preference manager, theme service. Depends on `core` for directives/pipes/styles. Public API at [libs/common/src/index.ts](libs/common/src/index.ts). All components standalone + OnPush + signal inputs; legacy NgModule wrappers (e.g. `preference-manager.module.ts`) kept for backward compat.

## preference-manager

- OWNS: UI for selecting / saving / sharing user preferences (filter saves) — [libs/common/src/lib/preference-manager/](libs/common/src/lib/preference-manager/)
- OWNS: `Preference` model `{id, name, user, identifierKey, payload, external, default}` and `ActivePreferencePipe` for chip display
- READS FROM: `preferences: Preference[]`, `activePreferenceId: string`, `dirty: boolean`, `loadingIndicator: boolean`, `identifierKey: string` inputs (parent-driven)
- WRITES TO: outputs `selectPreference(id)`, `editPreference(Preference)`, `setDefaultPreference(Preference)`, `deletePreference(id)`, `addNewPreference(Preference)`, `sharePreference(id)`
- INVARIANT: `payload` is opaque to the component — parent serialises/deserialises filter state into/out of it
- INVARIANT: `addNewPreference` emits a shell preference with `identifierKey` set but no `payload`; the parent must inject the current filter state before persisting
- INVARIANT: only one `default: true` per `identifierKey` is permitted but enforcement lives in the parent (component does not validate)
- TENSION: `identifierKey` input may be null at runtime (component does not throw); cross-scope selection becomes possible if parent doesn't filter the list
- TENSION: `sharePreference` is intentionally an opaque output — share semantics are app-specific (no stdlib path)
- DECIDED: parent owns persistence & validation; the component is purely a UI surface so consumers can wire any backend

## sto-action-footer

- OWNS: viewport-fixed action toolbar + body class side-effect — [libs/common/src/lib/sto-action-footer/](libs/common/src/lib/sto-action-footer/)
- READS FROM: `isLoading` model (two-way), `shouldAddClass: boolean = true`, `position: 'fixed'|'absolute' = 'fixed'`
- WRITES TO: `document.body.classList` adds/removes `sto-has-action-footer` (via Renderer2); progress bar visibility from `isLoading`
- INVARIANT: while mounted with `shouldAddClass=true`, the body MUST carry `sto-has-action-footer` so consumer CSS can apply `padding-bottom`; cleanup happens unconditionally in `destroyRef.onDestroy`
- TENSION: global body-class mutation conflicts if two action footers mount simultaneously; no guard
- TENSION: relies on consuming app to define `body.sto-has-action-footer { padding-bottom: ...}` rule
- DECIDED: `effect()` over `signal()`-only so the class is reasserted whenever `shouldAddClass` flips

## sto-app-header

- OWNS: app shell header — breadcrumbs, optional environment badge, projected user menu, dark-mode-aware styling — [libs/common/src/lib/sto-app-header/](libs/common/src/lib/sto-app-header/)
- READS FROM: inputs `testEnvironment`, `environmentName`, `userMenu: MatMenuPanel`, `homeBreadCrumbConfig: Breadcrumb`, `breadCrumbs: Breadcrumb[]`; `StoThemeService.getActiveTheme()` for dark-mode signal; `BreakpointObserver` for responsive collapse
- INVARIANT: `darkmode` is created via `toSignal(..., { initialValue: false })` to guarantee a synchronous value (avoids template async hazards)
- TENSION: directly couples to the root `StoThemeService`; cannot be swapped per-component-tree
- TENSION: when `testEnvironment=true` but `environmentName=''`, an empty badge renders (no validation)

## sto-breadcrumbs

- OWNS: breadcrumb list rendering with three navigation modes — [libs/common/src/lib/sto-breadcrumbs/](libs/common/src/lib/sto-breadcrumbs/)
- READS FROM: `home: Breadcrumb`, `model: Breadcrumb[]`, optional DI token `NAVIGATION_HOME_ICON: BreadcrumbConfig`
- WRITES TO: `Router.navigate(item.segment)`, `item.command()`, or browser navigation via `item.url`
- INVARIANT: each item supports one of `segment` (route), `command` (callback), `url` (href) — `segment` takes precedence in click handler; `disabled=true` cancels click
- INVARIANT: `command` callbacks must be idempotent (user may click repeatedly)
- TENSION: the three nav modes are not enforced as a discriminated union — TypeScript can't catch a bad shape
- DECIDED: manual `Router.navigate` chosen over `routerLink` so callback-mode + route-mode share one click handler

## sto-confirm-dialog

- OWNS: `ConfirmService.confirm()` factory + private `ConfirmComponent` template — [libs/common/src/lib/sto-confirm-dialog/](libs/common/src/lib/sto-confirm-dialog/)
- READS FROM: caller args `(message, title?, confirmText?, showCancel?, options?: Partial<MatDialogConfig>)`; `MAT_DIALOG_DATA` injected into component
- WRITES TO: returns `MatDialogRef.afterClosed(): Observable<boolean>` — true on confirm, false on cancel
- INVARIANT: result is always boolean (never null) — no 3-state outcome; callers can rely on truthy=confirm
- INVARIANT: defaults `width: 560px`, `panelClass: 'sto-dialog'`; user-supplied `options` shallow-merge over defaults
- INVARIANT: optional `title` — if falsy, `<h3 mat-dialog-title>` is omitted (no empty header)
- TENSION: returns `Observable<boolean>` not `Promise` — async/await consumers must `firstValueFrom`
- DECIDED: `ConfirmComponent` is intentionally not exported; only the service is the public API

## sto-filter

- OWNS: filter panel UI + `FilterForm` abstract base directive — [libs/common/src/lib/sto-filter/](libs/common/src/lib/sto-filter/)
- OWNS: projection slot directives `StoFilterTitle`, `StoFilterTableActions`, `StoFilterActions`
- READS FROM: subclass-provided `formConfig` (form builder shape) + `serializer: OperatorFunction<T, FilterList[]>`; `value: T` input (initial state)
- WRITES TO: `filterChanged: T` output whenever the form value changes; `filter` `linkedSignal` exposes current chip array
- INVARIANT: `formConfig` and `serializer` are abstract — every subclass MUST implement
- INVARIANT: chip array stays in lockstep with form value (auto-derived via `linkedSignal` + serializer)
- INVARIANT: form is constructed in `ngOnInit` (not the constructor) — relies on input signals being available
- TENSION: `clearFilter(key, index)` mutates form arrays in-place (immutability boundary leak vs. signal world)
- TENSION: `toggled()` window-resize dispatch helper is marked TODO for removal
- DECIDED: `FilterForm` is a Directive (not a Component) so subclasses can supply arbitrary templates while inheriting the form/chip plumbing

## sto-message-panel

- OWNS: inline alert/message component with severity, color, icon, and optional dismiss — [libs/common/src/lib/sto-message-panel/](libs/common/src/lib/sto-message-panel/)
- READS FROM: inputs `severity` (deprecated), `color: 'primary'|'accent'|'warning'|'danger'|'success'`, `icon: 'info'|'warning'|'error'|'help'`, `dismissable: boolean`
- WRITES TO: `dismissed: void` output when close button clicked
- INVARIANT: dismiss button shown when `dismissable !== false` (note: only literal `false` hides it — `null`/`undefined` still show it); component never auto-dismisses
- TENSION: `severity` is deprecated but still functional; if both `severity` and `icon` are set, `icon` wins
- DECIDED: split deprecated `severity` into explicit `icon` + `color` for finer control; consumers should migrate

## theme

- OWNS: theme + typography state (light|dark, sm|m|l) and body-class management — [libs/common/src/lib/theme/](libs/common/src/lib/theme/)
- OWNS: `StoThemeService` (root @Injectable) + pluggable `THEME_SAVER` DI token (default: `ThemeSaverService` localStorage impl)
- OWNS: Material icon registry setup (Material Icons Outlined + Equinor SVG)
- READS FROM: `THEME_SAVER`, `DOCUMENT`, `window.matchMedia('(prefers-color-scheme: dark)')`, `localStorage` (via saver), `MutationObserver` on `document.body.classList`
- WRITES TO: `document.body.classList` (theme + typography classes); `localStorage` via `saver.save()`; Material icon registry
- INVARIANT: exactly one theme class on `<body>` at all times — `sto-light-theme` XOR `sto-dark-theme`
- INVARIANT: exactly one typography class on `<body>` — `sto-sm-typography` XOR `sto-m-typography` XOR `sto-l-typography`
- INVARIANT: `MutationObserver` reconciles external class changes — third-party code that toggles theme classes will be picked up and the service's BehaviorSubject re-emits
- INVARIANT: theme name validated against the internal `themes` Map; unknown name falls back to system pref or light (never null)
- INVARIANT: `getActiveTheme()` returns `Observable<{name, className}>` for reactive UIs (used by `sto-app-header` darkmode signal)
- TENSION: root-only DI scope — no per-tree override; pluggable saver is the only escape hatch
- TENSION: `setTheme` persists immediately — no preview/rollback mode
- DECIDED: `MutationObserver` over change-detection-only sync so non-Angular code can interoperate (e.g. user-script dark-mode toggles); the trade-off is a possible micro-task race that the BehaviorSubject ultimately reconciles
- DECIDED: `THEME_SAVER` is a DI token (not a hard dep on localStorage) so apps can persist preferences server-side or in cookies

## public-api

- OWNS: TS public surface — [libs/common/src/index.ts](libs/common/src/index.ts) exports `PreferenceManagerComponent`, `StoActionFooterComponent`, `StoAppHeaderComponent`, `StoBreadcrumbsComponent`, `ConfirmComponent`, `ConfirmService`, `StoFilterPanelComponent`, `StoMessagePanelComponent`, `StoThemeService`, `ThemeSaverService`, `Breadcrumb`, `Preference`, related types

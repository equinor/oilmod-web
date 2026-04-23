---
domain: form
related: [core, common, theming]
---

# @ngx-stoui/form — Mental Model

Form controls + utilities: number input (with unit), slide toggle, select-filter, select-all option, WYSIWYG editor, FormFieldDirective meta-wrapper, signal/form helpers. Heavy `ControlValueAccessor` + `MatFormFieldControl<T>` patterns. Public API at [libs/form/src/index.ts](libs/form/src/index.ts). All components standalone; legacy NgModule wrappers deprecated. Form-specific theming in `core` SCSS — see [theming.md](theming.md).

## number-input-directive

- OWNS: keyboard + paste filtering on a native `<input>`; unit display toggle on focus/blur — [libs/form/src/lib/number-input/number-input.directive.ts](libs/form/src/lib/number-input/number-input.directive.ts)
- READS FROM: host keyboard/paste events; inputs `unit, appendUnit, fractionSize, dynamicFractionSize`
- WRITES TO: mutates native `el.value`; dispatches synthetic `input` event so reactive forms see the change
- INVARIANT: rejects characters matching `INVALID_CHARS_REGEX`; `cleanValue()` strips Word/Excel long-dash (`—`)
- INVARIANT: validation skipped when `readonly` or `disabled`
- TENSION: `afterNextRender(setDisplayValue)` toggles unit text — clipboard transformations are edge-case heavy (mixed `,`/`.` decimals)
- DECIDED: directive layer is pure DOM; reactive-forms integration lives in `NumberInputComponent`

## number-input-component

- OWNS: signal-based number form field implementing `ControlValueAccessor` + `MatFormFieldControl<number>` — [libs/form/src/lib/number-input/number-input/number-input.component.ts](libs/form/src/lib/number-input/number-input/number-input.component.ts)
- READS FROM: `valueModel` model input; `_disabled, _readonly, _required` inputs; optional `ngControl` (self); internal `FormControl` value
- WRITES TO: internal `ctrl.value`; emits to outer form via `ControlValueAccessor.registerOnChange`
- INVARIANT: extends `FormFieldBase`; signal inputs aliased so they satisfy the `MatFormFieldControl` interface (which expects plain properties)
- INVARIANT: subscribes to `ngControl.control.valueChanges` to handle external `setControl` swaps
- TENSION: dual-state — `valueModel` signal + internal `ctrl` `FormControl` — must stay in sync via effect; a major source of subtle bugs on form swaps
- DECIDED: error state matcher inherited from Material; `fractionSize` (fixed) vs `dynamicFractionSize` (trim trailing zeros) are mutually-aware decimal controls

## number-input-pipe

- OWNS: bidirectional number formatting — `transform()` for display, `parse()` for form value — [libs/form/src/lib/number-input/number-input.pipe.ts](libs/form/src/lib/number-input/number-input.pipe.ts)
- INVARIANT: Norwegian/Equinor locale — `,` decimal, ` ` (space) thousands; `.` is the form-internal decimal during `parse()`
- INVARIANT: `null`/`undefined` → empty string; `dynamicFractionSize=true` strips trailing zeros after the decimal
- INVARIANT: integer is zero-padded before thousands grouping is applied (alignment)

## number-unit-input-component

- OWNS: composite control bundling a number value with a unit selector inside one `MatFormFieldControl` — [libs/form/src/lib/number-input/number-unit-input/number-unit-input.component.ts](libs/form/src/lib/number-input/number-unit-input/number-unit-input.component.ts)
- READS FROM: inputs `list` (unit options), `unitOptional`, `unitClearText`, `fractionSize`; internal `FormGroup<{value, unit}>`
- WRITES TO: outer form gets `NumberUnit { value: number|string|null, unit: string|null }` via `ControlValueAccessor`
- INVARIANT: nested `FormGroup` is the source of truth; outer `writeValue({value, unit})` patches both child controls
- INVARIANT: uses `NumberInputDirective` on the inner number input
- TENSION: legacy `@Input() placeholder` mixed with signal inputs — beware when adding new inputs; pick one style

## slide-toggle-component

- OWNS: boolean toggle wrapping `MatSlideToggle` — [libs/form/src/lib/slide-toggle/slide-toggle.component.ts](libs/form/src/lib/slide-toggle/slide-toggle.component.ts)
- READS FROM: `color: ThemePalette`, `_readonly` input; optional `ngControl`; child `MatSlideToggle` ref
- WRITES TO: emits `toggled: StoSlideToggleChange` output; syncs to `ControlValueAccessor`; pushes to `stateChanges` Subject for `mat-form-field`
- INVARIANT: implements `ControlValueAccessor` + `MatFormFieldControl<boolean>`
- TENSION: Material `MatSlideToggle` has no native readonly mode — implemented by intercepting `change` and reverting; not bullet-proof
- DECIDED: `FocusMonitor` tracks focus for `errorState`/styling

## form-field-directive

- OWNS: meta-directive on `<mat-form-field stoFormField>` that observes the inner control and applies `sto-form__field--readonly`/`--disabled` classes + computes title — [libs/form/src/lib/sto-form/form-field.directive.ts](libs/form/src/lib/sto-form/form-field.directive.ts)
- READS FROM: `MatFormFieldControl` child via `contentChildren`; `title` input; optional `HIDE_FORM_FIELD_TITLE` DI token; `ngControl.valueChanges` if present
- WRITES TO: host `[title]` attribute; CSS classes; computed-title signal
- INVARIANT: subscribes to BOTH `stateChanges` (focus/disabled) and `valueChanges` because some operations (e.g. async `patchValue`) don't trigger `stateChanges` synchronously
- INVARIANT: title auto-derived from the control's label (MatInput, MatSelect, MatDateRangeInput) when not explicitly provided
- TENSION: dual subscription (state + value) is the canonical "this is hard" pattern — if you remove either, async patches stop updating the title

## sto-select-filter-component

- OWNS: filter input + select-all behavior inserted as a custom `mat-option` inside `mat-select` — [libs/form/src/lib/sto-select-filter/sto-select-filter.component.ts](libs/form/src/lib/sto-select-filter/sto-select-filter.component.ts)
- READS FROM: injected `MatSelect`; `isFilter`, `isMulti` inputs; internal `inputControl.valueChanges`; `select.ngControl.control.value`
- WRITES TO: emits `valueChanges: string` (filter text); emits `selectAll: boolean`
- INVARIANT: must be projected as a `mat-option` child of `mat-select` (not standalone)
- INVARIANT: checkbox state (`checked`/`indeterminate`/`unchecked`) computed from selected values vs visible options — assumes parent rebinds `mat-options` based on filter
- TENSION: tight coupling to parent — parent owns option-list filtering; component only signals intent

## sto-option-select-all-component

- OWNS: "select all / none" option for `mat-select` (multi) — [libs/form/src/lib/sto-option-select-all/sto-option-select-all.component.ts](libs/form/src/lib/sto-option-select-all/sto-option-select-all.component.ts)
- READS FROM: parent `MatSelect` (host injection or input); option list + selected values
- WRITES TO: `select.ngControl.control.setValue([all] | [])` on click; emits `selectionChange: boolean`
- INVARIANT: hosted with `class: 'mat-option'` — looks like a real option to Material
- INVARIANT: initialized in `afterNextRender()`; if no parent select found, hides itself with `display: none`
- INVARIANT: array-equality via `areArraysEqual()` to compute checked state

## wysiwyg-component

- OWNS: rich-text editor with bold/italic/underline + image insertion — [libs/form/src/lib/sto-wysiwyg/wysiwyg.component.ts](libs/form/src/lib/sto-wysiwyg/wysiwyg.component.ts)
- READS FROM: `readonly` input; `WysiwygEditorComponent` ref; `document.queryCommandState()` for active formatting modifiers
- WRITES TO: implements `ControlValueAccessor` (registered via `NG_VALUE_ACCESSOR`); mutates editor `<div>` HTML; calls `document.execCommand()`; sanitises output via `DomSanitizer`
- INVARIANT: input HTML sanitised before being written to the editor (XSS guard)
- TENSION: `document.execCommand()` is deprecated across browsers — long-term replacement (Selection API + ContentEditable manipulation) not yet planned
- TENSION: image insertion uses `window.prompt()` for URL — not a great UX; replace with file-picker dialog when redesigned

## form-utils

- OWNS: `formValueSignal(control, options?)` — wraps `valueChanges` into a `Signal<T>` — [libs/form/src/lib/utils/form-value-signal.ts](libs/form/src/lib/utils/form-value-signal.ts)
- INVARIANT: handles required signal inputs that may be unavailable at construction (returns `null` to avoid NG0950)
- INVARIANT: `includeDisabled=true` switches to `getRawValue()` instead of `value`
- OWNS: `toggleControl(form, name, condition)` — imperative enable/disable based on a predicate — [libs/form/src/lib/utils/toggle-form-control.ts](libs/form/src/lib/utils/toggle-form-control.ts)
- INVARIANT: no-op if state already matches; calls `enable`/`disable` with `emitEvent: false` to avoid cascading recalculation
- INVARIANT: throws if the named field is missing

## defaults-config

- OWNS: shared Material defaults — `formFieldConfig: MatFormFieldDefaultOptions` and `checkboxConfig: MatCheckboxDefaultOptions` exported from the lib
- DECIDED: provided so consumers can `provideX(...)` with one import to get the design-system-correct defaults

## public-api

- OWNS: TS public surface — [libs/form/src/index.ts](libs/form/src/index.ts) exports `NumberInputDirective, NumberInputPipe, NumberInputComponent, NumberUnitInputComponent, SlideToggleComponent, FormFieldDirective, HIDE_FORM_FIELD_TITLE, StoOptionSelectAllComponent, StoSelectFilterComponent, WysiwygComponent, WysiwygActionsComponent, WysiwygEditorComponent, formValueSignal, toggleControl, formFieldConfig, checkboxConfig` plus deprecated NgModule wrappers (`NumberInputModule, StoFormModule, SlideToggleModule, StoOptionSelectAllModule, StoSelectFilterModule, WysiwygModule`)
- DECIDED: deprecated modules retained — do not delete without a major-version bump

## cross-cutting-patterns

- INVARIANT: every form control implementing `ControlValueAccessor` must also push to a `stateChanges: Subject<void>` if it implements `MatFormFieldControl` — otherwise `mat-form-field` won't repaint on state transitions
- INVARIANT: cleanup uses `takeUntilDestroyed(destroyRef)` — never manual `Subscription.unsubscribe()` in this lib

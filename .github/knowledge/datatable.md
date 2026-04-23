---
domain: datatable
related: [core, common, theming]
---

# @ngx-stoui/datatable — Mental Model

Single feature: `<sto-datatable>` — a column/row table with sort, resize, virtual scroll, selection, context menus, header groups, and an actions toolbar. Depends on `core` + `common`. All components standalone; legacy NgModule wrapper retained at [libs/datatable/src/lib/sto-datatable/sto-datatable.module.ts](libs/datatable/src/lib/sto-datatable/sto-datatable.module.ts). Datatable-specific overrides live in `core` SCSS — see `_datatable.scss` referenced in [theming.md](theming.md).

## sto-datatable-component

- OWNS: top-level orchestration of rows, columns, groups, sort, selection, scroll, virtual viewport — [libs/datatable/src/lib/sto-datatable/sto-datatable.component.ts](libs/datatable/src/lib/sto-datatable/sto-datatable.component.ts)
- OWNS: `activeSort: linkedSignal<Sort | null>` with optional `localStorage` persistence
- READS FROM: inputs `groups, rows, columns, height, autoSize, virtualScroll, sortable, resizeable, selectionMode, rowHeight, headerHeight, preserveSort, columnMode, responsive, responsiveBreakPoint, externalSort, rowClass, emptyMessage, elevation, autoSizeOffset, disableRipple, loading`
- READS FROM: `selected: T` model (two-way); `window` resize events (debounced 100 ms) for responsive `smallScreen` signal
- WRITES TO: outputs `select: RowSelection<T>`, `rowContextMenu: RowContextMenu<T>`, `headerContextMenu: HeaderContextMenu`, `rowActivate: RowActivation<T>`, `sortChanged: {sort, column}`, `resized: {columns, column}`
- WRITES TO: `localStorage` key `${hostname}_${pathname}_sort` whenever `activeSort` mutates and `preserveSort=true`
- INVARIANT: when `virtualScroll=true`, `rowHeight` MUST equal actual row height — CDK virtual viewport sizing breaks otherwise
- INVARIANT: `height` numeric XOR `autoSize=true` (auto-calc uses `getBoundingClientRect()` on viewport)
- INVARIANT: only one row selected at a time (`selected` is a single value, not a set)
- INVARIANT: `smallScreen` flips when `window.innerWidth <= responsiveBreakPoint`
- TENSION: `localStorage` persistence key includes `pathname` — SPA route changes invalidate persisted sort silently
- TENSION: column ↔ row mismatch (`Column.prop` not in row) renders empty cells with no warning — generic typing not enforced against `T`
- DECIDED: `activeSort` as `linkedSignal` so persistence is automatic — no manual effect needed
- DECIDED: `preserveSort` is per-table (not global) so each datatable owns its persisted sort independently
- DECIDED: window resize via `toSignal(fromEvent(window,'resize'))` + debounce instead of `ResizeObserver` for broader browser support

## sto-datatable-body-component

- OWNS: row rendering (virtual or flat), selection click handling, ripple, horizontal scroll sync, keyboard activation, responsive small-view template — [libs/datatable/src/lib/sto-datatable/sto-datatable-body/](libs/datatable/src/lib/sto-datatable/sto-datatable-body/)
- READS FROM: inputs `rows, columns, selectionMode, selected, rowHeight, virtualScroll, scrollbarH, scrollLeft, rowClass, responsiveView, smallView, trackBy, disableRipple, width`; injected `StoRowWidthHelper`
- WRITES TO: outputs `rowSelected, rowContextMenu, activate, scrollHeader`; internal signals `horizontalScrollActive`, `verticalScrollOffset`
- INVARIANT: `selectionMode` of `'click'` selects on single click; `'dblclick'` selects on double click only
- INVARIANT: keyboard `Enter`/`Space` only activates when row has focus (`tabindex` required)
- INVARIANT: clicks inside `mat-select`, `mat-input`, etc. are ignored — filtered via `IGNORE_ELEMENT_REGEX` so cell-embedded controls don't trigger row selection
- INVARIANT: horizontal scroll sync emits `scrollHeader` with the scroll event; header listens and applies `translate3d(-scrollLeft, 0, 0)` to its container
- TENSION: scroll-sync via translate3d can drift mid-frame if parent updates `scrollLeft` between scroll events
- TENSION: `trackBy` defaults to index — wrong choice for sortable/filterable data; consumers MUST provide a stable key fn or selection breaks on row reuse
- DECIDED: ResizeObserver disposal happens via `destroyRef.onDestroy` (no explicit teardown needed)

## sto-datatable-header-component

- OWNS: header row, sort activation (Material `MatSort`), column resize via `CdkDrag`, header context menu — [libs/datatable/src/lib/sto-datatable/sto-datatable-header/](libs/datatable/src/lib/sto-datatable/sto-datatable-header/)
- READS FROM: inputs `columns, groups, rows, sortable, resizeable, activeSort, columnMode, headerHeight, rowHeight, bodyHeight, smallScreen, responsive, scrollLeft`; `StoRowWidthHelper.currentRowWidth` signal
- WRITES TO: outputs `sort: Sort`, `resized: {columns, column}`, `headerContextMenu: HeaderContextMenu`; mutates cell `flexBasis` via `Renderer2` during drag
- INVARIANT: `Column.flexBasis` defaults to `80` if unset; `MIN_COLUMN_WIDTH = 80` hardcoded for resize floor
- INVARIANT: after resize complete, the resized column has `flexGrow: 0, flexShrink: 0` — it becomes a fixed-width column permanently (until parent rebuilds the columns array)
- INVARIANT: only one column carries `activeSort` at a time
- FLOW[resize]: mousedown on resize handle → `CdkDrag.cdkDragMove` → `onResize()` updates `cell.style.flexBasis` + `tempWidth` signal → `CdkDragEnd` → `onResizeComplete()` → `Math.max(clientWidth || flexBasis + distance, MIN_COLUMN_WIDTH)` → emit `resized` with new columns array
- TENSION: post-resize fixed flex is by design but surprising — consumers expecting auto-flex behavior must rebuild columns
- TENSION: no column reorder support — `CdkDrag` reused only for resize
- DECIDED: width updated via `Renderer2` (not `[style.flexBasis]` binding) for performance during drag
- DECIDED: resize via `CdkDragEnd` event (not raw mouse listeners) for cleaner teardown

## sto-datatable-header-group-component

- OWNS: sticky header-of-headers (e.g. "Personal | Contact" spanning multiple columns) — [libs/datatable/src/lib/sto-datatable/sto-datatable-header-group/](libs/datatable/src/lib/sto-datatable/sto-datatable-header-group/)
- READS FROM: inputs `groups: ColumnGroup[]`, `columns: Column[]`, `height`, `width`, `transform`
- INVARIANT: each `ColumnGroup` has `name, columnStart, columnEnd` indices into the columns array; `transform` is computed as `translateX(sum(flexBasis of columns[0..columnStart-1]) + 8px gutter)`
- INVARIANT: empty `groups` or `columns` ⇒ no rendering
- TENSION: `columnStart` indices are brittle — column reorders require manual recomputation by the parent

## sto-datatable-actions-component

- OWNS: presentational action toolbar wrapper with left/right split — [libs/datatable/src/lib/sto-datatable/sto-datatable-actions/](libs/datatable/src/lib/sto-datatable/sto-datatable-actions/)
- READS FROM: `height: number = 47` input; projects content
- INVARIANT: three exported components — `StoDatatableActionsComponent` (container), `StoDataTableActionsLeftComponent`, `StoDataTableActionsRightComponent` — for the split layout

## column-model

- OWNS: column type definitions — [libs/datatable/src/lib/sto-datatable/columns.ts](libs/datatable/src/lib/sto-datatable/columns.ts) and [models.ts](libs/datatable/src/lib/sto-datatable/models.ts)
- OWNS: `Column { prop, name, flexGrow?, flexBasis?, flexShrink?, sortable?, cellTemplate?, footerTemplate?, headerTemplate?, cellClass?, headerClass?, sortFn?, disableSort?, disableResize?, sortArrowPosition? }`
- OWNS: `ColumnDisplay` enum (`Flex | Force`); `Group` (legacy?), `ColumnGroup { name, columnStart, columnEnd, transform? }`; `SortColumn { id, sortDir }`; `ClassFunction`, `SortFunction`, `rowClassFn` types
- INVARIANT: `Column.prop` MUST be unique within the columns array (acts as the key)
- INVARIANT: `Column.$$id` is an internal optional id used for trackBy

## events

- OWNS: typed event payloads — [libs/datatable/src/lib/sto-datatable/events.ts](libs/datatable/src/lib/sto-datatable/events.ts)
- OWNS: `ContextMenu {event, column}`; `RowContextMenu<T>` adds `{row, index}`; `HeaderContextMenu = ContextMenu`; `RowSelection<T> {row, index, event, rowEl?}`; `RowActivation<T>` (keyboard variant)
- INVARIANT: `event` is `MouseEvent | KeyboardEvent` depending on origin; `rowEl` may be `undefined` for keyboard activation

## selection-modes

- OWNS: `SelectionModesEnum { Click = 'click', DoubleClick = 'dblclick' }` — [selection-modes.ts](libs/datatable/src/lib/sto-datatable/selection-modes.ts)

## pipes-and-helpers

- OWNS: `ColumnStylePipe` — converts `Column + ColumnDisplay` to flex (`flexGrow/flexShrink/flexBasis`) or force (`width/maxWidth/float`) style object — [column-style.pipe.ts](libs/datatable/src/lib/sto-datatable/column-style.pipe.ts)
- OWNS: `ExecPipe` — invokes function with `(value, row, column)` or returns string as-is — [exec.pipe.ts](libs/datatable/src/lib/sto-datatable/exec.pipe.ts)
- OWNS: `GetGroupFlexPipe` — sums `flexBasis` of grouped columns; emits `0 0 ${px}` if any column is fixed, else `${count} 1 ${px}` — [get-group-flex.pipe.ts](libs/datatable/src/lib/sto-datatable/get-group-flex.pipe.ts)
- OWNS: `observeWidth(el)` — `ResizeObserver` → `Observable<number>`; auto-`disconnect` on unsubscribe — [observer.ts](libs/datatable/src/lib/sto-datatable/observer.ts)
- OWNS: `StoRowWidthHelper` — DI service holding `currentRowWidth` signal; provided in datatable's component-tree scope so header + body share width state — [sto-row-width.helper.ts](libs/datatable/src/lib/sto-datatable/sto-row-width.helper.ts)

## storybook

- OWNS: scenarios in [datatable.stories.ts](libs/datatable/src/lib/datatable.stories.ts) (Interactive playground, EmptyState, LoadingState) and [datatable-custom.stories.ts](libs/datatable/src/lib/datatable-custom.stories.ts) (Responsive, WithPagination using `mat-paginator` + `virtualScroll=false`, WithFooter)
- INVARIANT: pagination scenarios disable virtual scroll because `mat-paginator` slices `rows` externally and CDK virtual viewport assumptions break

## public-api

- OWNS: TS public surface — [libs/datatable/src/index.ts](libs/datatable/src/index.ts) exports `StoDatatableComponent`, `Column`, `ColumnGroup`, event types, `SelectionModes`, `GetGroupFlexPipe`, `StoDatatableActionsComponent`

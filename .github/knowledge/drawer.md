---
domain: drawer
related: [core, common, theming]
---

# @ngx-stoui/drawer — Mental Model

Two feature areas: `<sto-drawer>` (animated side panel with header/footer/wrapper slots) and `<sto-nav-drawer>` (collapsible navigation list with router integration). Animations live in [animation.ts](libs/drawer/src/lib/animation.ts). Public API at [libs/drawer/src/index.ts](libs/drawer/src/index.ts). Standalone components; legacy NgModule wrappers deprecated. Drawer SCSS overrides live in `core` (see [theming.md](theming.md)).

## sto-drawer-component

- OWNS: side panel state (open/closed), position (left/right), animations, offset/padding/width, keyboard + outside-click handling — [libs/drawer/src/lib/sto-drawer/sto-drawer.component.ts](libs/drawer/src/lib/sto-drawer/sto-drawer.component.ts)
- READS FROM: `open` model (two-way); inputs `position: 'left'|'right', width, offset, padding, animation, backdrop, closeOnClick, ignoreEscKey`
- READS FROM: `contentChild(StoDrawerFooterComponent)` to detect optional footer for layout calc
- WRITES TO: outputs `onToggle(boolean), onOpen(), onClose(), cancel(), submit()`; host `[style.width]` + `[class.open]`; `@drawerAnimations` trigger
- INVARIANT: animation state computed from `(position, animation, open)` tuple — yields `open-left | open-right | closed-left | closed-right | openImmediate | closedImmediate-*`
- INVARIANT: `submit` emits on Ctrl+S; ESC closes unless `ignoreEscKey=true`; outside click toggles only if `backdrop=true`
- INVARIANT: two-way `open` model — parent should bind `[(open)]="isOpen"` for full state ownership
- TENSION: many animation states (cross product of position × open × animation flag) — adding a new position would multiply states again
- DECIDED: `slideInOut` computed signal drives the animation trigger so the template stays declarative

## sto-drawer-slots

- OWNS: header / footer / wrapper projection shells — `StoDrawerHeaderComponent`, `StoDrawerFooterComponent`, `StoDrawerWrapperComponent` ([libs/drawer/src/lib/sto-drawer/](libs/drawer/src/lib/sto-drawer/))
- INVARIANT: pure `<ng-content>` wrappers with CSS classes (`sto-drawer__header`, etc.) — no logic
- INVARIANT: `StoDrawerComponent` queries footer via `contentChild(StoDrawerFooterComponent)` to measure its height for layout — moving footer outside the drawer breaks layout
- DECIDED: shells exist (rather than CSS-only slot selectors) so consumers get type-safe imports + standalone composition

## nav-drawer-component

- OWNS: navigation list container; collapsed state; emits item activations — [libs/drawer/src/lib/nav-drawer/nav-drawer.component.ts](libs/drawer/src/lib/nav-drawer/nav-drawer.component.ts)
- READS FROM: `collapsed` model; `navigationItems: Navigation[]` input; `withAppHeader: boolean` input
- WRITES TO: emits `activate: Navigation` when an item is clicked; sets `collapsed=true` after activation
- INVARIANT: `headerOffset = '5em'` constant — adjust if `sto-app-header` height changes
- INVARIANT: uses `overlayAnimation` trigger for the backdrop fade

## nav-drawer-item-component

- OWNS: individual nav row with optional children, expansion state, router-aware active styling — [libs/drawer/src/lib/nav-drawer/nav-drawer-item/nav-drawer-item.component.ts](libs/drawer/src/lib/nav-drawer/nav-drawer-item/nav-drawer-item.component.ts)
- READS FROM: required `navigationItem: Navigation` input; `collapsed` input; injected `Router`; subscribes to `Router.events.pipe(filter(NavigationEnd))` for active-route detection
- WRITES TO: emits `activate(Navigation)`; updates `expansionState` signal; applies `RouterLink` + `RouterLinkActive` directives
- INVARIANT: two animation triggers — `indicatorRotate` (chevron) + `bodyExpansion` (slide-in children)
- INVARIANT: child items rendered via `NavDrawerListComponent` (recursive composition)
- TENSION: uses a custom `EXPANSION_PANEL_ANIMATION_TIMING` constant — Angular Material 21 removed the `mat-expansion-panel` animation export, so timing is hand-rolled
- TENSION: tracks two parallel "active" notions — `expanded` (UI state) and route-active (Router state); they can diverge

## nav-drawer-list-component

- OWNS: simple list rendering of child navigation items + activate event proxy — [libs/drawer/src/lib/nav-drawer/nav-drawer-list/nav-drawer-list.component.ts](libs/drawer/src/lib/nav-drawer/nav-drawer-list/nav-drawer-list.component.ts)
- READS FROM: `navigationItems: NavigationChild[]` input
- WRITES TO: re-emits `activate: NavigationChild` from child items

## animations

- OWNS: animation trigger definitions exported as `drawerAnimations`, `drawerOpenAnimation`, `overlayAnimation` — [libs/drawer/src/lib/animation.ts](libs/drawer/src/lib/animation.ts)
- INVARIANT: `drawerOpenAnimation` — 400 ms ease-in-out slide + 1 ms opacity offset; `overlayAnimation` — 400 ms fade `0 → 0.08` (enter) and back (leave)
- DECIDED: 400 ms is the brand-consistent panel timing; do not tune individually per drawer instance

## public-api

- OWNS: TS public surface — [libs/drawer/src/index.ts](libs/drawer/src/index.ts) exports `StoDrawerComponent, StoDrawerHeaderComponent, StoDrawerFooterComponent, StoDrawerWrapperComponent, StoDrawerModule, NavDrawerComponent, NavDrawerModule, NavDrawerItemComponent, NavDrawerListItemComponent, NavDrawerListComponent, Navigation, NavigationChild` types + `drawerAnimations, drawerOpenAnimation, overlayAnimation`

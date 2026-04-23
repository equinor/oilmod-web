---
domain: popover
related: [core, theming]
---

# @ngx-stoui/popover — Mental Model

Anchor-attached overlay built on `@angular/cdk/overlay`. Pattern: `[stoPopoverTrigger]` directive on the trigger element, `<sto-popover>` component receives the directive ref via `[trigger]` input, optional `<sto-popover-title>` and `[stoPopoverFooter]` slots. Public API at [libs/popover/src/index.ts](libs/popover/src/index.ts). Module wrapper deprecated.

## popover-directive

- OWNS: trigger anchor — extends `CdkOverlayOrigin` so the overlay can compute connected positions — [libs/popover/src/lib/popover.directive.ts](libs/popover/src/lib/popover.directive.ts)
- OWNS: open state via `open$: BehaviorSubject<boolean>` exposed as `openStream` Observable
- READS FROM: `openPopoverOn: 'click' | 'hover'` input; host `click` and `mouseenter` events
- WRITES TO: `open$.next(!open$.value)` on trigger; `open()`/`close()` public methods
- INVARIANT: must export as `stoPopoverTrigger` so templates can capture `#trigger="stoPopoverTrigger"` and pass it to `<sto-popover [trigger]="trigger">`
- TENSION: `'hover'` mode is incomplete — `mouseenter` opens but there's no `mouseleave` close path; treat hover as experimental
- DECIDED: state lives in the directive (not the component) so multiple popovers can share one trigger ref pattern

## popover-component

- OWNS: CDK overlay container, positioning, backdrop, ESC-to-close, SVG arrow rendering — [libs/popover/src/lib/popover.component.ts](libs/popover/src/lib/popover.component.ts)
- READS FROM: required `trigger: PopoverDirective` input; subscribes to `trigger().openStream` (via `async` pipe in template) to drive `CdkConnectedOverlay` open state
- WRITES TO: positions overlay via `CdkConnectedOverlay` connected positions (top-centered, bottom-centered hardcoded); on backdrop click calls `trigger().close()`
- INVARIANT: `viewportMargin` keeps the popover in viewport bounds; `minWidth`/`minHeight` prevent collapse to zero
- INVARIANT: ESC closes via `@HostListener('document:keydown.escape')` on the component (not the directive)
- TENSION: ESC handling is on the component while click-toggle is on the directive — asymmetric; if you ever want ESC to be conditional, the logic split makes it harder
- TENSION: the two `positions` are public and hardcoded — no input to customise without subclassing
- DECIDED: SVG arrow is inline in the template + styled in [popover.component.scss](libs/popover/src/lib/popover.component.scss) (rotated per position class `.top` / `.bottom`)

## popover-title-component

- OWNS: header section with title text + close button — [libs/popover/src/lib/popover-title.component.ts](libs/popover/src/lib/popover-title.component.ts)
- READS FROM: injected parent `PopoverComponent`; projected `<ng-content>`
- WRITES TO: close button calls `popover.trigger().close()`
- INVARIANT: projected via selector `sto-popover-title` slot in `<sto-popover>`; renders Material `close` icon + `MatDivider`

## popover-footer-component

- OWNS: footer section — [libs/popover/src/lib/popover-footer.component.ts](libs/popover/src/lib/popover-footer.component.ts)
- INVARIANT: attribute selector `[stoPopoverFooter]` (not an element) — projected via attribute-selector slot in `<sto-popover>`
- INVARIANT: renders `MatDivider` above projected content

## popover-styles

- OWNS: layout — [libs/popover/src/lib/popover.component.scss](libs/popover/src/lib/popover.component.scss)
- INVARIANT: `.sto-popover` is a 3-row CSS Grid (title / content / footer) using `--bg-card` token from EDS
- INVARIANT: arrow is 6×8 px SVG; rotation handled by position-class modifiers (`.bottom` rotate -90deg, `.top` rotate 90deg)

## public-api

- OWNS: TS public surface — [libs/popover/src/index.ts](libs/popover/src/index.ts) exports `PopoverComponent, PopoverDirective, PopoverTitleComponent, PopoverFooterComponent`
- INVARIANT: `PopoverModule` is intentionally NOT in the public index — direct imports only; the module file stays for users importing it manually before the next major
- DECIDED: standalone-only public API to discourage module pattern adoption

## usage-pattern

- FLOW: `<button stoPopoverTrigger #trigger="stoPopoverTrigger">Open</button>` → `<sto-popover [trigger]="trigger"><sto-popover-title>Title</sto-popover-title>...content...<div stoPopoverFooter>...</div></sto-popover>`
- INVARIANT: `[trigger]` is required — without it the overlay has no anchor and never opens

---
applyTo: '**/*.scss'
---

# Theming & SCSS — oilmod-web

## Material 3 Theming

This project uses **Angular Material M3** with `use-system-variables: true` and EDS (Equinor Design System) token overrides.

```scss
// libs/core/src/styles/_material-theme.scss
@use '@angular/material' as mat;

$sto-theme: mat.define-theme(
  (
    color: (
      theme-type: light,
      use-system-variables: true,
    ),
    typography: (
      use-system-variables: true,
    ),
    density: (
      scale: 0,
    ),
  )
);

@mixin apply-material-theme() {
  @include mat.core();
  :root {
    @include mat.all-component-themes($sto-theme);
  }
}
```

## EDS Design Tokens

Colors and spacing are defined as CSS custom properties in `_tokens.scss`:

```scss
// EDS base colors (with light-dark() for dark mode support)
--eds-foreground-primary: light-dark(#3d3d3d, #ffffff);
--eds-background-default: light-dark(#ffffff, #132634);

// Primary (teal)
--primary-resting: light-dark(#007079, #97cace);
--primary-hover: light-dark(#004f55, #ade2e6);

// Status
--status-danger, --status-warning, --status-success
```

Material system variables are overridden in `:root` to map M3 tokens to EDS values (typography, colors, spacing).

## Using Theme Tokens in Components

Reference EDS tokens via CSS custom properties:

```scss
.sto-my-component {
  color: var(--eds-foreground-primary);
  background: var(--eds-background-default);
  border-color: var(--primary-resting);
}
```

## Style Architecture

```
libs/core/src/styles/
├── index.scss              # Main entry: @forward + @use all modules
├── _material-theme.scss    # M3 theme definition + system variable overrides
├── _tokens.scss            # EDS CSS custom properties (single source of truth)
├── _utilities.scss         # Grid system, helper classes
├── _overrides.scss         # Global Material component overrides
├── fonts/                  # Equinor font (13px base)
├── components/             # Per-component global styles (_drawer.scss, etc.)
├── forms/                  # Form-specific styles
└── datatable/              # Datatable-specific styles
```

## Conventions

- Use `@use` instead of `@import` (Sass module system).
- Scope component styles — avoid global selectors.
- Use CSS custom properties (`var(--eds-*)`) for colors, not hardcoded values.
- Prefix all custom classes with `sto-` to avoid collisions with consumers.
- Base font: **Equinor, 13px** (not the standard 14px/16px).
- Dark mode is supported via `light-dark()` in tokens — no separate dark theme file.

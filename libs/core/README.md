# @ngx-stoui/core

Core packages like styling, pipes and common directives for Angular, based on EDS design styles.

## Installation

```bash
npm install @ngx-stoui/core
```

## Public API

### Compiled Stylesheets

Import these in your `styles.scss` or `angular.json`:

```scss
// Main stylesheet with all components and utilities
@import '@ngx-stoui/core/ngx-stoui.css';

// Datatable stylesheet (optional, if using datatables)
@import '@ngx-stoui/core/ngx-datatable.css';
```

### SCSS Utilities (for advanced usage)

#### Grid System

Use the grid mixin to create responsive grid layouts:

```scss
@use '@ngx-stoui/core/style/grid' as grid;

.my-grid {
  @include grid.grid(12); // 12-column grid
}

.my-compact-grid {
  @include grid.grid(4, 'column', 0); // 4-column grid with custom class name
}
```

#### Theme Variables and Mixins

Access theme variables, typography, and create custom themed components:

```scss
@use 'sass:map';
@import '@ngx-stoui/core/style/theme/theme';

// Access theme variables
@mixin my-component-theme($theme, $variables) {
  $primary: map.get($variables, primary);
  $accent: map.get($variables, accent);

  .my-component {
    background: $primary;
    color: $accent;
  }
}

// Apply to light and dark themes
.light-theme {
  @include my-component-theme($sto-theme, $variables);
}

.dark-theme {
  @include my-component-theme($sto-dark-theme, $dark-variables);
}
```

#### Typography Only

If you only need typography definitions:

```scss
@import '@ngx-stoui/core/style/theme/typography';

// Access typography variables:
// - $sto-typography (default 13px)
// - $sto-sm-typography (small 10px)
// - $sto-l-typography (large 16px)
```

## Available Exports

### Compiled CSS

- `ngx-stoui.css` - Main stylesheet
- `ngx-datatable.css` - Datatable styles

### SCSS Utilities

- `style/grid.scss` - Grid mixin system
- `style/theme/theme.scss` - Complete theme with variables and components
- `style/theme/_typography.scss` - Typography configurations
- `style/theme/_theme.scss` - Theme color palettes
- `style/theme/_colors.scss` - Color definitions
- `style/theme/_theme-variables.scss` - Theme variable functions
- `style/theme/components.scss` - All component styles

### Fonts

- Equinor font files (`.woff`, `.woff2`)

## Usage Examples

### Basic Setup

```scss
// styles.scss
@import '@ngx-stoui/core/ngx-stoui.css';
```

### With Grid System

```scss
// styles.scss
@use '@ngx-stoui/core/style/grid' as grid;
@import '@ngx-stoui/core/ngx-stoui.css';

.product-grid {
  @include grid.grid(6); // 6-column grid
}
```

### With Custom Theming

```scss
// styles.scss
@use 'sass:map';
@import '@ngx-stoui/core/ngx-stoui.css';
@import '@ngx-stoui/core/style/theme/theme';

@mixin app-theme($theme, $variables) {
  // Your custom theme styles using $variables
}

@include app-theme($sto-theme, $variables);

.sto-dark-theme {
  @include app-theme($sto-dark-theme, $dark-variables);
}
```

## Running unit tests

Run `nx test core` to execute the unit tests.

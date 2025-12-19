# Styles Folder Architecture

## Overview

The new `styles/` directory provides a clean, intuitive structure that eliminates the complex import chains of the old `style/` folder. All CSS variables are centralized, and the import path is straightforward.

## Directory Structure

```
styles/
├── index.scss                    # Main entry point (import this!)
├── _tokens.scss                  # Design system tokens and CSS variables
├── _material-theme.scss          # Material 3 theme configuration
├── _typography.scss              # Typography scales (normal, small, large)
├── _utilities.scss               # Utility classes (grid, helpers)
├── fonts/
│   └── _fonts.scss               # Font loading from CDN
└── components/
    ├── _index.scss               # Component barrel file
    ├── _action-footer.scss       # Individual component styles
    ├── _appheader.scss
    ├── _card.scss
    ├── _datatable.scss
    ├── _daterange.scss
    ├── _dialog.scss
    ├── _drawer.scss
    ├── _filterpanel.scss
    ├── _input-overrides.scss
    ├── _message-panel.scss
    ├── _number-input.scss
    ├── _number-unit-input.scss
    ├── _preference-manager.scss
    ├── _select-filter.scss
    ├── _status-indicators.scss
    └── _wysiwyg.scss
```

## Import Flow

### New Structure (Simplified)

```
ngx-stoui.scss
  └─> styles/index.scss
        ├─> _tokens.scss (CSS variables)
        ├─> _material-theme.scss (Material 3)
        ├─> _typography.scss (Typography scales)
        ├─> _utilities.scss (Grid utilities)
        ├─> fonts/_fonts.scss (Font loading)
        └─> components/_index.scss
              └─> All component files
```

### Old Structure (Complex)

```
ngx-stoui.scss
  └─> style/theme/_theme.scss
        ├─> _colors.scss (M2 palettes)
        ├─> _theme-variables.scss (M2 functions)
        ├─> components.scss
        │     └─> 21 individual component imports
        └─> Circular dependencies
```

## Key Files

### `index.scss` - Main Entry Point

Single file to import for all styles. Automatically includes:

- Design tokens
- Material theme
- Typography
- Utilities
- Component styles

**Usage:**

```scss
@use './styles' as *;
```

### `_tokens.scss` - Design System Tokens

**Single source of truth** for all CSS variables:

- Light theme colors (`:root`, `body:not(.sto-dark-theme)`)
- Dark theme colors (`body.sto-dark-theme`)
- EDS (Equinor Design System) SCSS maps
- No dependencies

**Available CSS Variables:**

```scss
// Primary colors
--primary-resting, --primary-hover, --primary-text

// Accent colors
--accent-resting, --accent-hover, --accent-text

// Status colors
--success-*, --danger-*, --warning-*

// Text colors
--text, --text-secondary, --text-tertiary, --text-disabled

// Background colors
--bg-default, --bg-app, --bg-card, --bg-hover, --bg-focus

// UI elements
--divider, --border-disabled
```

### `_material-theme.scss` - Material 3 Configuration

Material Design 3 theme setup with `mat.define-theme()`:

- Azure/blue color scheme
- Component theme includes
- CSS variable overrides for Material components

**Mixin:**

```scss
@include material-theme.apply-material-theme();
```

### `_typography.scss` - Typography Scales

Three typography hierarchies:

- `$sto-typography` - Normal scale (13px base)
- `$sto-sm-typography` - Small scale (10px base)
- `$sto-l-typography` - Large scale (16px base)

**Mixin:**

```scss
@include typography.apply-typography();
```

### `_utilities.scss` - Utility Classes

Flexible grid system and helper classes:

- `.sto-grid` - Responsive grid using CSS Container Queries (auto 1→2→4 columns based on container width)
- `.sto-grid--{n}` - Fixed column layouts (`--1`, `--2`, `--3`, `--4`, `--6`, `--12`) that override responsive behavior
- `.sto-grid__col` - Grid column with span modifiers (`--2`, `--3`, `--4`)
- `.sto-grid__col--spacer` - Hidden spacer column for layout alignment

### `components/_index.scss` - Component Barrel

Imports all component styles and provides single mixin:

```scss
@include components.apply-component-styles();
```

## Migration from Old Structure

### What Changed?

1. **Folder Name**: `style/` → `styles/` (avoids Windows permission issues)

2. **Import Chain**:
   - Old: 4-5 levels deep with circular dependencies
   - New: Flat structure, clear hierarchy

3. **CSS Variables**:
   - Old: Duplicated in `ngx-stoui.scss` and `_colors.scss`
   - New: Single source in `_tokens.scss`

4. **Material Theme**:
   - Old: Material 2 with palette extraction
   - New: Material 3 with direct theme definition

5. **Component Organization**:
   - Old: Nested in `style/theme/` with barrel file
   - New: Flat in `styles/components/` with barrel file

### Migration Status

✅ **Completed:**

- Created new `styles/` folder structure
- Migrated all 16 component files from `style/theme/`
- Migrated form styles from `style/form/`
- Migrated datatable styles from `style/datatable/`
- Centralized CSS variables in `_tokens.scss`
- Converted to Material 3 in `_material-theme.scss`
- Updated `ngx-stoui.scss` to use new structure
- Removed all legacy imports
- Build successful
- Lint passing

✅ **Migration Complete!** All files have been moved to the new structure. The old `style/` folder can now be removed.

### Old `style/` Folder (Deprecated)

The old `style/` folder is now deprecated and can be safely deleted. All styles have been migrated to the new `styles/` structure.

## Best Practices

### 1. Use CSS Variables Directly

```scss
// ✅ CORRECT
.my-component {
  color: var(--text);
  background: var(--bg-card);
}

// ❌ AVOID (old pattern)
.my-component {
  color: $text-color; // SCSS variable wrapper
}
```

### 2. Component Styles

Component files should export mixins:

```scss
@mixin my-component-theme() {
  .my-component {
    border: 1px solid var(--divider);
  }
}
```

### 3. Import Order

When creating new files, follow this order:

```scss
// 1. Design tokens (if needed)
@use '../tokens';

// 2. Material dependencies (if needed)
@use '@angular/material' as mat;

// 3. Component styles
@mixin my-component-theme() {
  // styles here
}
```

### 4. Flat Structure

Keep component files flat - avoid nesting:

- `components/_my-component.scss` ✅
- `components/feature/_my-component.scss` ❌

## Benefits

1. **Discoverability**: Easy to find where styles are defined
2. **No Circular Dependencies**: Clear import hierarchy
3. **Single Source of Truth**: CSS variables in one place
4. **Modern Material**: Material 3 API
5. **Clean Separation**: Tokens, theme, typography, components
6. **Easy Debugging**: Flat structure, clear file names
7. **Performance**: Removed duplicate CSS variable definitions

## Future Improvements

1. Migrate `style/form/` to `styles/forms/`
2. Migrate `style/datatable/` to `styles/components/datatable/`
3. Convert remaining `@import` to `@use`/`@forward`
4. Remove old `style/` folder
5. Add Storybook integration for design tokens
6. Document CSS variable usage in component stories

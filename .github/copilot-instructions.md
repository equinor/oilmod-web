# GitHub Copilot Instructions - oilmod-web

## Architecture Overview

oilmod-web is a **reusable Angular component library** (@ngx-stoui) providing Equinor's design system components. This is NOT an application but a **publishable library monorepo** built with Nx and distributed as npm packages.

## Repository Structure

```
oilmod-web/
├── libs/
│   ├── core/              # Foundation: themes, utilities, base components
│   ├── common/            # Shared models, services, utilities
│   ├── datatable/         # Data table components
│   ├── drawer/            # Drawer/sidebar components
│   ├── error-handler/     # Error handling utilities
│   ├── form/              # Form components and utilities
│   ├── popover/           # Popover/tooltip components
│   └── testing/           # Test utilities and mocks
├── apps/
│   └── oilmod-web/        # Storybook application for component showcase
└── package.json           # Workspace config (bun + Angular 20+)
```

## Critical Development Patterns

### 1. Library Architecture - Publishable Modules

Each library under `libs/` is **independently publishable** to npm as `@ngx-stoui/{name}`:

```json
// Each lib has its own package.json with correct exports
{
  "name": "@ngx-stoui/core",
  "version": "20.0.12",
  "peerDependencies": {
    "@angular/core": "^20.0.0"
  }
}
```

**Dependencies between libraries**:
- `core` → Foundation (no dependencies)
- `common` → Depends on `core`
- `datatable`, `drawer`, `form`, `popover` → Depend on `core` and `common`

### 2. Angular 20+ Modern Patterns

**Standalone Components** (no `NgModule`):
```typescript
@Component({
  selector: 'sto-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `<button mat-button>{{label()}}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoButtonComponent {
  readonly label = input<string>('');
}
```

**Modern Control Flow**:
```html
@if (data(); as items) {
  @for (item of items; track item.id) {
    <sto-card>{{item.name}}</sto-card>
  }
}
```

### 3. Component API Design - Signals First

```typescript
export class StoDataTableComponent<T> {
  // Input signals for reactive props
  readonly data = input<T[]>([]);
  readonly columns = input<ColumnConfig[]>([]);
  readonly loading = input<boolean>(false);
  
  // Output signals for events
  readonly rowClick = output<T>();
  readonly selectionChange = output<T[]>();
  
  // Computed signals for derived state
  readonly filteredData = computed(() => 
    this.applyFilters(this.data(), this.filters())
  );
}
```

### 4. Theming System (Angular Material + Custom)

Components extend Angular Material themes with Equinor branding:

```scss
// libs/core/src/styles/_theme.scss
@use '@angular/material' as mat;

$equinor-primary: mat.define-palette($mat-red);
$equinor-theme: mat.define-light-theme((
  color: (
    primary: $equinor-primary,
    accent: $equinor-accent,
  )
));

@include mat.all-component-themes($equinor-theme);
```

**Usage in components**:
```scss
@use '../../../styles/theme' as theme;

.sto-button {
  background-color: theme.$primary-color;
}
```

## Essential Workflows

### Development with Local Linking (yalc)

When developing libraries for use in other projects:

```bash
# Start development mode (auto-builds + pushes to yalc)
bun run dev

# This runs concurrently:
# - Builds libs in watch mode
# - Pushes updates to yalc on changes (8s debounce)

# In consuming project (e.g., BioCertificateManagement/client/)
yalc add @ngx-stoui/core @ngx-stoui/common @ngx-stoui/datatable
bun install
```

**Why yalc instead of npm link?** - yalc copies files rather than symlinking, avoiding module resolution issues.

### Building Libraries

```bash
# Build all publishable libraries
bun run build

# Build specific library
nx build core
nx build datatable

# Build in watch mode
bun run build:watch
```

### Testing

```bash
# Run all tests
bun run test

# Test specific library
nx test core

# Run affected tests only
nx affected:test
```

### Publishing

```bash
# Build and publish all libs to npm
bun run publish:all

# Publish to yalc for local development
bun run yalc:publish
```

### Storybook Development

```bash
# Run Storybook for component documentation/testing
bun run storybook

# Build Storybook for deployment
bun run storybook:build
```

## Component Development Guidelines

### Creating a New Component

1. **Generate component in appropriate library**:
```bash
nx generate @nx/angular:component my-component --project=core --export
```

2. **Follow signal-based API**:
```typescript
@Component({
  selector: 'sto-my-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoMyComponent {
  readonly data = input.required<MyData>();
  readonly config = input<MyConfig>({ /* defaults */ });
  readonly action = output<MyEvent>();
}
```

3. **Create Storybook story**:
```typescript
// libs/core/src/lib/my-component/my-component.stories.ts
export default {
  title: 'Core/MyComponent',
  component: StoMyComponent,
} satisfies Meta<StoMyComponent>;

export const Default: StoryObj<StoMyComponent> = {
  args: {
    data: { /* mock data */ }
  }
};
```

4. **Export from library**:
```typescript
// libs/core/src/index.ts
export * from './lib/my-component/my-component.component';
```

### Accessibility Requirements

All components MUST meet WCAG 2.1 AA standards:

```typescript
// Proper ARIA attributes
@Component({
  host: {
    'role': 'button',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'disabled()',
    '(keydown.enter)': 'handleKeydown($event)',
    '(keydown.space)': 'handleKeydown($event)'
  }
})
```

## Technology Stack

- **Angular**: 20.3+ (standalone components, signals, modern control flow)
- **Package Manager**: bun (fast, npm-compatible)
- **Build System**: Nx 21+ monorepo tooling
- **UI Foundation**: Angular Material 20+
- **Testing**: Jest with Angular Testing Library patterns
- **Storybook**: Component documentation and visual testing
- **Styling**: SCSS with Angular Material theming

## Common Patterns

### Dependency Injection

```typescript
// Modern inject() function
export class MyService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(CONFIG_TOKEN);
}
```

### Error Handling

```typescript
// Use error-handler library
import { ErrorHandlerService } from '@ngx-stoui/error-handler';

export class MyService {
  private readonly errorHandler = inject(ErrorHandlerService);
  
  loadData() {
    return this.http.get('/api/data').pipe(
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
```

### Form Integration

```typescript
// Use reactive forms with signals
import { FormControl, FormGroup } from '@angular/forms';

export class MyFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  readonly formValue = toSignal(this.form.valueChanges);
}
```

## Publishing Checklist

Before publishing a new version:

1. ✅ All tests pass: `bun run test`
2. ✅ No lint errors: `bun run lint`
3. ✅ Build succeeds: `bun run build`
4. ✅ Version bumped in affected packages
5. ✅ Changelog updated
6. ✅ Peer dependencies match Angular version
7. ✅ Storybook builds: `bun run storybook:build`

## Integration with Consumer Projects

Projects using @ngx-stoui libraries (BioCertificateManagement, InventoryManagementValuation, etc.):

```bash
# In consumer project
bun add @ngx-stoui/core@latest @ngx-stoui/common@latest

# Or for local development
yalc add @ngx-stoui/core
```

**Import pattern**:
```typescript
import { StoButtonComponent } from '@ngx-stoui/core';
import { StoDataTableComponent } from '@ngx-stoui/datatable';
```

## Troubleshooting

### Build Issues

```bash
# Clear Nx cache
bun run clean

# Reset Nx
nx reset

# Clean install
rm -rf node_modules && bun install
```

### yalc Sync Issues

```bash
# In oilmod-web
bun run yalc:publish

# In consumer project
yalc update
bun install
```

### Peer Dependency Conflicts

Ensure consumer projects use compatible Angular versions (20.x matches @ngx-stoui 20.x).

## Next Steps for AI Agents

1. Review component examples in `libs/core/src/lib/`
2. Examine Storybook stories for component APIs
3. Check `nx.json` for project configurations
4. Read `package.json` scripts for available commands
5. Explore theming system in `libs/core/src/styles/`

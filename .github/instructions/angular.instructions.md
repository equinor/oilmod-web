---
applyTo: 'libs/**/*.ts,libs/**/*.html,apps/**/*.ts,apps/**/*.html'
---

# Angular Conventions — oilmod-web

## General

- **Angular 21** with standalone components and signal-based APIs.
- **No `NgModule`-based components** — every dependency is listed in the `imports` array of the `@Component` decorator.
- `ChangeDetectionStrategy.OnPush` on every component.
- Selector prefix: **`sto-`** (e.g. `selector: 'sto-button'`).
- Deprecated `NgModule` wrappers still exist for backward compatibility with consumers — do NOT create new ones, and do NOT delete existing ones without a major version bump.

## Signals First

All new and refactored code **must** use Angular Signals:

- `input()` / `output()` instead of `@Input()` / `@Output()`.
- `input.required<T>()` when a value must be provided.
- `model()` for two-way binding (e.g. `readonly collapsed = model(false)`).
- `viewChild()` / `viewChildren()` instead of `@ViewChild()` / `@ViewChildren()`.
- `signal()` and `computed()` for local component state.
- `effect()` for side effects based on signal changes.

```typescript
export class StoDataTableComponent<T> {
  readonly data = input<T[]>([]);
  readonly columns = input<ColumnConfig[]>([]);
  readonly loading = input<boolean>(false);

  readonly rowClick = output<T>();
  readonly selectionChange = output<T[]>();

  readonly filteredData = computed(() => this.applyFilters(this.data(), this.filters()));
}
```

## Templates

- Prefer `@if`, `@for`, `@switch` control flow over `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use `track` in `@for` for lists.
- Keep templates small — extract complex logic into computed signals or helper methods.

```html
@if (data(); as items) { @for (item of items; track item.id) {
<sto-card>{{ item.name }}</sto-card>
} }
```

## Dependency Injection

- Use `inject()` exclusively — no constructor injection:
  ```typescript
  private readonly http = inject(HttpClient);
  private readonly config = inject(CONFIG_TOKEN);
  ```

## Forms

- Prefer **reactive forms** (`FormGroup`, `FormControl`) over template-driven.
- Use typed forms: `FormGroup<{ name: FormControl<string> }>`.
- Bridge to signals with `toSignal(form.valueChanges)`.

## Accessibility

All components MUST meet WCAG 2.1 AA standards:

```typescript
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

## Error Handling

```typescript
import { ErrorHandlerService } from '@ngx-stoui/error-handler';

export class MyService {
  private readonly errorHandler = inject(ErrorHandlerService);

  loadData() {
    return this.http.get('/api/data').pipe(catchError((err) => this.errorHandler.handle(err)));
  }
}
```

## Testing

- Unit tests with **Jest** — run via `nx test <lib>`.
- Use `TestBed.configureTestingModule()` with standalone component imports.
- Mock services with `{ provide: MyService, useValue: mockService }`.
- Prefer testing behavior over implementation details.

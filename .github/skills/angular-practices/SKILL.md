---
name: angular-practices
description: 'Angular best practices and patterns for oilmod-web library development. USE WHEN writing new components, services, directives, pipes, or refactoring Angular code. Trigger words: component, service, directive, pipe, signal, inject, standalone, reactive, observable, change detection, performance, lazy, template, binding.'
---

This project uses Angular 21 with standalone components. Follow current Angular best practices.

For the authoritative reference, fetch: `https://angular.dev/llms.txt`
For the full detailed guide, fetch: `https://angular.dev/assets/context/llms-full.txt`

---

## Quick Reference

The `angular.instructions.md` file (auto-loaded for .ts/.html files) contains the detailed conventions. This skill supplements with workflow guidance.

## Signal Migration Patterns

When refactoring legacy code to signals:

```typescript
// BEFORE (legacy)
@Input() data: T[] = [];
@Output() rowClick = new EventEmitter<T>();
@ViewChild('table') table: ElementRef;

// AFTER (signals)
readonly data = input<T[]>([]);
readonly rowClick = output<T>();
readonly table = viewChild<ElementRef>('table');

// Two-way binding
readonly collapsed = model(false);  // replaces @Input() + @Output() pair
```

## ControlValueAccessor with Signals

Common pattern in form components:

```typescript
export class StoMyInputComponent implements ControlValueAccessor {
  readonly value = signal<string>('');
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string) {
    this.value.set(val);
  }
  registerOnChange(fn: (v: string) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
```

## Deprecated NgModule Handling

~12 deprecated NgModule wrappers persist for backward compatibility. When working on these files:

- Do NOT delete the module — consumers may still import it
- Mark new standalone exports alongside the module export in `index.ts`
- Add `@deprecated` JSDoc to any new module (if absolutely necessary)

## Performance Checklist

- `ChangeDetectionStrategy.OnPush` on every component
- `track` expression in every `@for` loop
- `computed()` for derived state (never recalculate in templates)
- `inject()` over constructor injection
- Individual Material imports (e.g. `MatButtonModule`), not barrel imports

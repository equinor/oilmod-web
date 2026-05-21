import {
  DestroyRef,
  Directive,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { toFormValueSignal } from '@ngx-stoui/form';
import { OperatorFunction } from 'rxjs';
import { startWith } from 'rxjs/operators';

export interface FilterList {
  key: string;
  value: string;
  index?: number;
}

/**
 * Abstract class utilized to decrease boilerplate for filters.
 * Given that most filters are identical in their base setup (a reactive form, using sto-filter-panel etc), this simplifies writing filters.
 * It also allows you to have filter chips in your filter title with a base implementation (only needs a formConfig & serializer fn)
 */
@Directive()
export abstract class FilterForm<
  T extends Record<string, unknown>,
> implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  // FormBuilder config
  abstract formConfig: { [key: string]: unknown };
  // Serializer function
  abstract serializer: OperatorFunction<T, FilterList[]>;

  // Most filters will emit a filterChanged event
  readonly filterChanged = output<T>();

  // Initial value of the filter
  readonly value = input<T>();

  // Form group
  public form!: UntypedFormGroup;
  // Wrap the form in a signal so toFormValueSignal can lazily attach to it
  // once ngOnInit constructs it. Without the wrapper, the field-init runs
  // during super() with `this.form === undefined`, which throws inside
  // toFormValueSignal and aborts the rest of the field initializers
  // (leaving `filter` undefined and breaking the template).
  private readonly formSig = signal<UntypedFormGroup | null>(null);
  private readonly formValue = toFormValueSignal(this.formSig);

  // Chip value as signal. See {@link FilterList}. Populated in ngOnInit
  // after the form and the (abstract) `serializer` are available.
  public readonly filter = signal<FilterList[]>([]);

  constructor() {
    // React to value input changes and reset form.
    //
    // Guarded by a structural equality check: parent state-management
    // typically returns a NEW object reference on every cycle (NgRx
    // selectors, computed signals etc.), even when the values are
    // unchanged. Without the guard, `value()` updates → reset → form
    // valueChanges → `formValue()` updates → effect below emits →
    // parent dispatches → new `value()` reference → reset → ...
    // Angular 21 treats this as NG0103 (infinite change detection).
    effect(() => {
      const val = this.value();
      if (val && this.form && !this.valuesEqual(val, this.form.value as T)) {
        this.form.reset(val);
      }
    });

    // Emit filter changes — same guard: don't re-emit a value the
    // parent already gave us (closes the loop on the other side, in
    // case the parent doesn't dedupe before dispatching).
    effect(() => {
      const formValue = this.formValue();
      if (
        formValue != null &&
        !this.valuesEqual(formValue as T, this.value() as T)
      ) {
        this.filterChanged.emit(formValue as T);
      }
    });
  }

  /**
   * Structural equality for filter values. JSON.stringify is sufficient
   * for the simple plain-object shapes filters carry (primitives, dates
   * already serialized, small arrays). Key order is the form-config
   * order on both sides, so it's stable.
   */
  private valuesEqual(
    a: T | null | undefined,
    b: T | null | undefined,
  ): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  ngOnInit() {
    this.form = this.fb.group(this.formConfig);
    this.form.reset(this.value() || {});
    this.formSig.set(this.form);

    // Wire chip array via the subclass-provided serializer.
    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        this.serializer,
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((chips) => this.filter.set(chips));
  }

  /**
   * This function clears the value for the given key.
   * If index is passed in, it assumes the value for the key is an array, and removes the value at the given index.
   * @param key - The form control key to clear
   * @param index - Optional array index to remove (for array-type controls)
   */
  public clearFilter(key: string, index?: number): void {
    if (index !== undefined) {
      const val = [...(this.form.get(key)?.value ?? [])];
      val.splice(index, 1);
      this.form.get(key)?.reset(val);
    } else {
      this.form.get(key)?.reset();
    }
  }

  /**
   * Util function to resize tables. Looking to get rid of this...
   * @deprecated
   */
  public toggled(): void {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }
}

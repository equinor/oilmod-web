import {
  DestroyRef,
  Directive,
  OnInit,
  effect,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { toFormValueSignal } from '@ngx-stoui/form';
import { OperatorFunction } from 'rxjs';

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
export abstract class FilterForm<T extends Record<string, unknown>>
  implements OnInit
{
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
  private formValue = toFormValueSignal(this.form);

  // Chip value as signal. See {@link FilterList}
  public readonly filter = linkedSignal<FilterList[]>(() => {
    // Sync signal updates
    return this.formValue() || [];
  });

  constructor() {
    // React to value input changes and reset form
    effect(() => {
      const val = this.value();
      if (val && this.form) {
        this.form.reset(val);
      }
    });

    // Emit filter changes
    effect(() => {
      const formValue = this.formValue() as T;
      this.filterChanged.emit(formValue);
    });
  }

  ngOnInit() {
    this.form = this.fb.group(this.formConfig);
    this.form.reset(this.value() || {});
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

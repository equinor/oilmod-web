import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';

export interface FilterList {
  key: string;
  value: string;
  index?: number;
}

/**
 * Abstract class utilized to decrease boiler plate for filters.
 * Given that most filters are identical in their base setup (a reactive form, using sto-filter-panel etc), this simplify writing filters.
 * It also allows you to have filter chips in your filter title with a base implementation (only needs a formConfig & serializer fn)
 */
@Directive()
export abstract class FilterForm<T extends Record<string, unknown>>
  implements OnInit, OnDestroy
{
  private readonly fb = inject(UntypedFormBuilder);
  // FormBuilder config
  abstract formConfig: { [key: string]: unknown };
  // Serializer function
  abstract serializer: OperatorFunction<T, FilterList[]>;
  // Most filters will emit a filterChanged event
  readonly filterChanged = output<T>();
  // Initial value of the filter
  // TODO: Cannot migrate because:
  // Other classes extending this is writing to this property
  @Input()
  value: T;
  // Form group
  public form: UntypedFormGroup;
  // Chip value. See {@link FilterList}
  public filter$: Observable<FilterList[]>;
  protected destroyed$ = new Subject();

  ngOnInit() {
    this.form = this.fb.group(this.formConfig);
    this.form.reset(this.value || {});
    this.filter$ = this.form.valueChanges.pipe(
      startWith<T>(this.form.value as T),
      this.serializer,
    );
    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        debounceTime(250),
        takeUntil(this.destroyed$),
      )
      .subscribe((value) => this.filterChanged.emit(value));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * This function clears the value for the given key.
   * If index is passed in, it assumes the value for the key is an array, and removes the value at the given index.
   * @param key
   * @param index
   */
  public clearFilter(key: string, index?: number) {
    if (index || index === 0) {
      const val = [...(this.form.get(key)?.value ?? [])];
      val.splice(index, 1);
      this.form.get(key)?.reset(val);
    } else {
      this.form.get(key)?.reset();
    }
  }

  // Util function to resize tables. Looking to get rid of this...
  public toggled() {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }
}

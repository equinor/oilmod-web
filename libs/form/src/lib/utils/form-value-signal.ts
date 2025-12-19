import { effect, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl } from '@angular/forms';
import { merge, Observable, startWith, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FormValueSignalOptions {
  /**
   * Whether to include disabled fields in the value.
   * - `true` (default): Uses `getRawValue()` to include all fields (enabled and disabled)
   * - `false`: Uses `value` to include only enabled fields
   */
  includeDisabled?: boolean;
}

/**
 * Creates a signal from a form's valueChanges.
 * Works whether `form` is a signal or a plain property.
 *
 * @param formOrSignal - The form control, group, or array (or a signal containing one)
 * @param options - Configuration options
 * @param options.includeDisabled - Whether to include disabled fields (default: true)
 * @returns A signal containing the form value
 */
export function toFormValueSignal<T extends AbstractControl>(
  formOrSignal: T | Signal<T | null | undefined>,
  options?: FormValueSignalOptions,
): Signal<T extends AbstractControl<infer V> ? V : unknown> {
  const { includeDisabled = true } = options ?? {};

  // Check if it's a signal-like object (includes both Signal and InputSignal)
  const isSignalLike = typeof formOrSignal === 'function';
  const formSignal: Signal<T | null | undefined> = isSignalLike
    ? (formOrSignal as Signal<T | null | undefined>)
    : signal(formOrSignal as T);

  const valueChanges$ = new Observable<unknown>((sub) => {
    let innerSub: Subscription | undefined;

    const watch = () => {
      const form = formSignal();
      innerSub?.unsubscribe();

      if (form) {
        const isFormControl = form instanceof FormControl;
        const defaultValue = isFormControl ? null : {};

        // Get the appropriate value based on includeDisabled option
        const getCurrentValue = () =>
          includeDisabled ? form.getRawValue() : form.value;

        // Subscribe to both valueChanges and statusChanges to catch all updates
        // valueChanges only emits when enabled fields change
        // statusChanges emits when any field changes (including disabled ones)
        const changes$ = merge(form.valueChanges, form.statusChanges).pipe(
          startWith(null), // emit current value first
          map(() => getCurrentValue() ?? defaultValue),
        );

        innerSub = changes$.subscribe((value) => {
          sub.next(value);
        });
      } else {
        // no form yet → emit null for FormControl, {} for FormGroup/FormArray
        sub.next(null);
      }
    };

    // re-run whenever formSignal changes
    const stop = effect(watch);

    // Cleanup on destroy
    return () => {
      innerSub?.unsubscribe();
      stop.destroy();
    };
  });

  const form = formSignal();
  const isFormControl = form instanceof FormControl;
  const initialValue = form
    ? ((includeDisabled ? form.getRawValue?.() : form.value) ??
      (isFormControl ? null : {}))
    : isFormControl
      ? null
      : {};

  return toSignal(valueChanges$, {
    initialValue,
  });
}

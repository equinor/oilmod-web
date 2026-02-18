import { effect, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface FormValueSignalOptions {
  /**
   * Whether to include disabled fields in the value.
   * - `true` (default): Uses `getRawValue()` to include all fields (enabled and disabled)
   * - `false`: Uses `value` to include only enabled fields
   */
  includeDisabled?: boolean;
}

/** Safely read a signal, returning null if it throws (e.g., NG0950 for required inputs) */
function safeRead<T>(sig: Signal<T>): T | null {
  try {
    return sig();
  } catch {
    return null;
  }
}

/** Safely get form value with fallback */
function getFormValue(
  form: AbstractControl | null | undefined,
  includeDisabled: boolean,
): unknown {
  if (!form) return null;
  try {
    return includeDisabled ? form.getRawValue() : form.value;
  } catch {
    return form instanceof FormControl ? null : {};
  }
}

/**
 * Creates a signal from a form's valueChanges.
 * Works whether `form` is a signal or a plain property.
 *
 * Supports required input signals - the signal will emit `null` initially
 * until the input becomes available, then emit the form value.
 *
 * @param formOrSignal - The form control, group, or array (or a signal containing one)
 * @param options - Configuration options
 * @param options.includeDisabled - Whether to include disabled fields (default: true)
 * @returns A signal containing the form value
 *
 * @example
 * // With a plain FormControl
 * readonly formValue = toFormValueSignal(this.myForm);
 *
 * @example
 * // With an input signal (including required inputs)
 * readonly ctrl = input.required<FormControl<string>>();
 * readonly ctrlValue = toFormValueSignal(this.ctrl);
 */
export function toFormValueSignal<T extends AbstractControl>(
  formOrSignal: T | Signal<T | null | undefined>,
  options?: FormValueSignalOptions,
): Signal<T extends AbstractControl<infer V> ? V : unknown> {
  const { includeDisabled = true } = options ?? {};
  const isSignalLike = typeof formOrSignal === 'function';
  const formSignal = isSignalLike
    ? (formOrSignal as Signal<T | null | undefined>)
    : signal(formOrSignal as T);

  const valueChanges$ = new Observable<unknown>((sub) => {
    let innerSub: Subscription | undefined;

    const stop = effect(() => {
      const form = safeRead(formSignal);
      innerSub?.unsubscribe();

      if (!form) {
        sub.next(null);
        return;
      }

      innerSub = merge(form.valueChanges, form.statusChanges)
        .pipe(
          startWith(null),
          map(() => getFormValue(form, includeDisabled)),
        )
        .subscribe({
          next: (v) => sub.next(v),
          error: () => {}, // Ignore errors from destroyed forms
        });
    });

    return () => {
      innerSub?.unsubscribe();
      stop.destroy();
    };
  });

  const initialValue = isSignalLike
    ? null
    : getFormValue(formOrSignal as T, includeDisabled);
  return toSignal(valueChanges$, { initialValue }) as Signal<
    T extends AbstractControl<infer V> ? V : unknown
  >;
}

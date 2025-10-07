import { effect, isSignal, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { Observable, startWith, Subscription } from 'rxjs';

/**
 * Creates a signal from a form's valueChanges.
 * Works whether `form` is a signal or a plain property.
 */
export function toFormValueSignal<T extends AbstractControl>(
  formOrSignal: T | Signal<T | null>,
): Signal<NonNullable<ReturnType<T['getRawValue']>> | object> {
  const formSignal: Signal<T | null> = isSignal(formOrSignal) ? formOrSignal : signal(formOrSignal as T);

  const valueChanges$ = new Observable<any>((sub) => {
    let innerSub: Subscription | undefined;

    const watch = () => {
      const form = formSignal();
      innerSub?.unsubscribe();

      if (form) {
        // Subscribe to current raw value
        innerSub = form.valueChanges
          .pipe(startWith(form.getRawValue() ?? {})) // emit current value first
          .subscribe((v) => sub.next(v ?? {})); // emit every change afterwards
      } else {
        // no form yet → emit {}
        sub.next({});
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

  return toSignal(valueChanges$, {
    initialValue: formSignal()?.getRawValue?.() ?? {},
  });
}

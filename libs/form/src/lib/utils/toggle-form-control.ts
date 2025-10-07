import { AbstractControl, FormGroup } from '@angular/forms';

export type ConditionFn<T = any> = (value?: T) => boolean;
export type Condition<T = any> = boolean | ConditionFn<T>;

/**
 * Enables or disables a control based on a condition.
 * - If condition is true → control should be enabled.
 * - If condition is false → control should be disabled.
 * - If the control is already in the desired state, do nothing.
 */
export function toggleControl<T = any>(form: FormGroup, fieldName: string, condition: Condition<T>): void {
  const control: AbstractControl | null = form.get(fieldName);
  if (!control) {
    throw new Error(`Control with name "${fieldName}" not found in form`);
  }

  // Evaluate condition
  const shouldEnable = typeof condition === 'function' ? condition(control.value as T) : condition;

  // Toggle control state if needed
  const isCurrentlyEnabled = control.enabled;
  if (shouldEnable && !isCurrentlyEnabled) {
    control.enable({ emitEvent: false });
  } else if (!shouldEnable && isCurrentlyEnabled) {
    control.disable({ emitEvent: false });
  }
}

import { ElementRef, inject } from '@angular/core';
import {
  FormGroupDirective,
  NgControl,
  NgForm,
  UntypedFormControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';

export class FormFieldBase {
  ngControl = inject(NgControl, { optional: true, self: true });
  _parentForm = inject(NgForm, { optional: true });
  _parentFormGroup = inject(FormGroupDirective, { optional: true });
  _defaultErrorStateMatcher = inject(ErrorStateMatcher);
  elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Whether the component is in an error state. */
  errorState = false;

  /**
   * Stream that emits whenever the state of the input changes such that the wrapping
   * `MatFormField` needs to run change detection.
   */
  stateChanges: Subject<void>;

  errorStateMatcher: ErrorStateMatcher;

  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
    const control = this.ngControl
      ? (this.ngControl.control as UntypedFormControl)
      : null;
    const newState = matcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
}

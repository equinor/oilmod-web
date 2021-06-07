import { Subject } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class FormFieldBase {
  /** Whether the component is in an error state. */
  errorState = false;

  /**
   * Stream that emits whenever the state of the input changes such that the wrapping
   * `MatFormField` needs to run change detection.
   */
  stateChanges: Subject<void>;

  errorStateMatcher: ErrorStateMatcher;

  constructor(public _elementRef: ElementRef,
              public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {
  }

  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
    const control = this.ngControl ? this.ngControl.control as FormControl : null;
    const newState = matcher.isErrorState(control, parent);

    if ( newState !== oldState ) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
}

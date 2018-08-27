import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

/**
 * Serializes a FormGroup, and sets the form as "pristine" if a change is reverted.
 * Used to simplify the {@link UnsavedChangesGuard} and improve usage (not showing a modal if form is same as original)
 */
export class FormSerializeValidator {

  constructor( private _form: FormGroup, private destroyed$: Subject<boolean> ) {
    this.orginalValue = this._form;

    /**
     * Listen for form status changes, and update the current value.
     */
    this._form.statusChanges
      .pipe(
        takeUntil( this.destroyed$ )
      ).subscribe( change => {
      this.orginalValue = this._form;
    } );

    /**
     * Listen for changes to the form values.
     * If the new value is equal to the original value, mark form as pristine
     */
    this._form.valueChanges
      .pipe(
        takeUntil( this.destroyed$ )
      ).subscribe( changedValue => {
      if ( this._form.dirty ) {
        const current_value = this.replaceEmptyStringsWithNull( this._form.value );
        if ( this.originalValue == current_value ) {
          this._form.markAsPristine();
        }
      }
    } );
  }

  private _originalValue: any;

  public get originalValue(): any {
    return this._originalValue;
  }

  public set orginalValue( form: any ) {
    if ( form && !form.dirty ) {
      this._originalValue = this.replaceEmptyStringsWithNull( form.value );
    }
  }

  private replaceEmptyStringsWithNull( value ) {
    return JSON.stringify( value ).replace( /""/g, 'null' );
  }

}
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

export class FormSerializeValidator {

  private _originalValue: any;

  public set orginalValue(form : any){
    if(form && !form.dirty) {
      this._originalValue = this.replaceEmptyStringsWithNull(form.value);
    }
  }

  private replaceEmptyStringsWithNull(value) {
    return JSON.stringify(value).replace(/""/g, 'null');
  }

  public get originalValue() : any{
    return this._originalValue;
  }


  constructor(private _form: FormGroup, private destroyed$: Subject<boolean>) {
    this.orginalValue = this._form;

    this._form.statusChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(change => {
      this.orginalValue = this._form;
    });

    this._form.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(changedValue => {
      if(this._form.dirty) {
        const current_value = this.replaceEmptyStringsWithNull(this._form.value);
        if (this.originalValue == current_value) {
          this._form.markAsPristine();
         }
    }});
  }

}
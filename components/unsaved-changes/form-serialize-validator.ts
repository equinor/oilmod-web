import { FormGroup } from '@angular/forms';

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


  constructor(private _form: FormGroup) {
    this.orginalValue = this._form;

    this._form.statusChanges.subscribe(change => {
      this.orginalValue = this._form;
    });

    this._form.valueChanges.subscribe(changedValue => {

      if(this._form.dirty) {
        const current_value = this.replaceEmptyStringsWithNull(this._form.value);

        if (this.originalValue == current_value) {
          this._form.markAsPristine();
         }
    }});
  }

}
import { FormGroup } from '@angular/forms';

export class FormSerializeValidator {

  private _originalValue: any;

  public set orginalValue(form : any){
    if(form && !form.dirty) {
      this._originalValue = JSON.stringify(form.value).replace('\"\"', 'null');
    }
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
        const current_value = JSON.stringify(this._form.value).replace('\"\"', 'null');

        if (this.originalValue == current_value) {
          this._form.markAsPristine();
         }
    }});
  }

}
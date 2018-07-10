import { AbstractControl, ValidatorFn } from '@angular/forms';

export function AutoCompleteValidator(list: any[], key): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const inList = !!list.find(item => item[key] === control.value);
    return inList || !control.value ? null : {'optionSelected': 'Invalid option selected'};
  };
}
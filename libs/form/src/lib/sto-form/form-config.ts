import { MatCheckboxDefaultOptions } from '@angular/material/checkbox';
import { MatFormFieldDefaultOptions } from '@angular/material/form-field';

export const formFieldConfig: MatFormFieldDefaultOptions = {
  // floatLabel: 'always',
  color: 'primary',
  // appearance: 'fill',
};

export const checkboxConfig: MatCheckboxDefaultOptions = {
  color: 'primary',
  clickAction: 'check-indeterminate',
};

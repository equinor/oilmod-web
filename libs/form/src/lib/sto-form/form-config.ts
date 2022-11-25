import { MatLegacyFormFieldDefaultOptions } from '@angular/material/legacy-form-field';
import { MatCheckboxDefaultOptions } from '@angular/material/checkbox';

export const formFieldConfig: MatLegacyFormFieldDefaultOptions = {
  floatLabel: 'always',
  color: 'primary',
  appearance: 'legacy',
};

export const checkboxConfig: MatCheckboxDefaultOptions = {
  color: 'primary',
  clickAction: 'check-indeterminate'
};

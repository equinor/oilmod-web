import { MatLegacyFormFieldDefaultOptions } from '@angular/material/legacy-form-field';
import { MatLegacyCheckboxDefaultOptions as MatCheckboxDefaultOptions } from '@angular/material/legacy-checkbox';

export const formFieldConfig: MatLegacyFormFieldDefaultOptions = {
  floatLabel: 'always',
  color: 'primary',
  appearance: 'legacy',
};

export const checkboxConfig: MatCheckboxDefaultOptions = {
  color: 'primary',
  clickAction: 'check-indeterminate'
};

#### DateFormFieldClickDirective
Directive that can be placed on mat-form-fields that contains a mat-datepicker.

This directive has two tasks:
 1. Clicking anywhere on the mat-form-field will open the datepicker dialog
 2. When the datepicker is closed in any manner, we shift focus back to the datepicker input

##### Usage
```html
<mat-form-field [stoDateFormFieldClick]="picker">
    <input matInput
        formControlName="date"
        [matDatepicker]="picker" placeholder="Date">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

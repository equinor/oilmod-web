import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
// import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatLegacyFormFieldModule as MatFormFieldModule
} from '@angular/material/legacy-form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormFieldDirective, StoFormModule } from '@ngx-stoui/form';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export default {
  title: 'form/Form field directive',
  component: FormFieldDirective,
  parameters: {},
  decorators: [
    moduleMetadata({
      imports: [ MatFormFieldModule, MatInputModule, StoFormModule, MatSelectModule,
        BrowserAnimationsModule, MatCardModule, TextFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatNativeDateModule ],
      providers: [ { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } } ]
    }),

  ],
} as Meta;

const Template: Story<FormFieldDirective & Record<string, unknown>> = (args) => {
  return {
    component: FormFieldDirective,
    props: {
      ...args,
      formGroup: new UntypedFormGroup({
        first: new UntypedFormControl('Some value'),
        dates: new UntypedFormGroup({
          start: new UntypedFormControl(new Date()),
          end: new UntypedFormControl(null)
        })
      }),
      dropdown: 'B'
    },
    template: `
  <mat-card class="sto-form">
<mat-form-field [formGroup]="formGroup" stoFormField *ngIf="withClasses">
<mat-label>Form field with styles</mat-label>
<input  formControlName="first" [disabled]="disabled" [readonly]="readonly" matInput>
</mat-form-field>
<mat-form-field [formGroup]="formGroup" stoFormField *ngIf="withClasses">
<mat-label>Date range picker</mat-label>
<mat-date-range-input formGroupName="dates" [rangePicker]="picker">
    <input matStartDate formControlName="start" placeholder="Start date">
    <input matEndDate formControlName="end" placeholder="End date">
  </mat-date-range-input>
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-date-range-picker #picker></mat-date-range-picker>
</mat-form-field>
<mat-form-field stoFormField *ngIf="withClasses">
<mat-label>Form field with styles</mat-label>
<mat-select name="dropdown" [ngModel]="dropdown" (selectionChange)="dropdown = $event">
<mat-option value="A">A</mat-option>
<mat-option value="B">B</mat-option>
</mat-select>
</mat-form-field>
<mat-form-field appearance="fill" *ngIf="!withClasses">
<mat-label>Form field without styles</mat-label>
<input value="Some value" [disabled]="disabled" [readonly]="readonly" matInput>
</mat-form-field>
<mat-form-field stoFormField *ngIf="withClasses">
<mat-label>Text area with styles</mat-label>
<textarea name="test" matInput [cdkTextareaAutosize]="true">
Some Text Content

Should not select all on click
</textarea>
</mat-form-field>
</mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  withClasses: true,
  readonly: false,
  disabled: false,
};

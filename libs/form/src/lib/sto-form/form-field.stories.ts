import { TextFieldModule } from '@angular/cdk/text-field';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormFieldDirective, StoFormModule } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<any> = {
  title: 'form/Form field directive',
  component: FormFieldDirective,
  parameters: {},
  decorators: [
    moduleMetadata({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        StoFormModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatCardModule,
        TextFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [
        {
          provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
          useValue: { floatLabel: 'always' },
        },
      ],
    }),
  ],
};
export default meta;

export const Usage: StoryObj = {
  args: { withClasses: true, readonly: false, disabled: false },
  render: (args) => ({
    component: FormFieldDirective,
    props: {
      ...args,
      formGroup: new UntypedFormGroup({
        first: new UntypedFormControl('Some value'),
        dates: new UntypedFormGroup({
          start: new UntypedFormControl(new Date()),
          end: new UntypedFormControl(null),
        }),
      }),
      dropdown: 'B',
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
<mat-form-field *ngIf="!withClasses">
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
</mat-card>`,
  }),
};

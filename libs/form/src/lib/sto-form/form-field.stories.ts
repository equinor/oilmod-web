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
  args: {
    readonly: false,
    disabled: false,
    customTitle: '',
    disableTitle: false,
    hideFormFieldTitle: false,
  },
  argTypes: {
    readonly: { control: 'boolean', description: 'Makes input readonly' },
    disabled: { control: 'boolean', description: 'Disables the input' },
    customTitle: {
      control: 'text',
      description: 'Custom tooltip override (hover over field to see tooltip)',
    },
    disableTitle: {
      control: 'boolean',
      description:
        'Disable automatic tooltip generation (affects HTML title attribute)',
    },
    hideFormFieldTitle: {
      control: 'boolean',
      description:
        'Hide tooltip globally using injection token (affects HTML title attribute)',
    },
  },
  render: (args) => ({
    props: {
      ...args,
      formGroup: new UntypedFormGroup({
        textInput: new UntypedFormControl(
          'Hover to see title - click to select all',
        ),
        singleDate: new UntypedFormControl(new Date()),
        dateRange: new UntypedFormGroup({
          start: new UntypedFormControl(new Date()),
          end: new UntypedFormControl(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ),
        }),
        multiSelect: new UntypedFormControl(['Option A', 'Option B']),
        dropdown: new UntypedFormControl('Option B'),
        textarea: new UntypedFormControl(`Multi-line text
Should NOT select all on click
This is expected behavior for textareas`),
        testField: new UntypedFormControl('Inspect element'),
        alwaysReadonly: new UntypedFormControl('This field is always readonly'),
        alwaysDisabled: new UntypedFormControl({
          value: 'This field is always disabled',
          disabled: true,
        }),
      }),
      updateDisabledState(formGroup: UntypedFormGroup, disabled: boolean) {
        Object.keys(formGroup.controls).forEach((key) => {
          // Skip the alwaysDisabled control - it should remain disabled
          if (key === 'alwaysDisabled') {
            return;
          }

          const control = formGroup.get(key);
          if (disabled) {
            control?.disable({ emitEvent: false });
          } else {
            control?.enable({ emitEvent: false });
          }
        });
      },
    },
    template: `
  <style>
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .demo-full-width {
      grid-column: 1 / -1;
    }
  </style>

  <mat-card class="sto-form sto-card">
    {{updateDisabledState(formGroup, disabled)}}
    <mat-card-title class="sto-card__title">
      <h3>Form Field Directive - All Features</h3>
    </mat-card-title>
    <mat-card-subtitle class="sto-card__subtitle">
      Demonstrates: CSS classes, title attribute, data-cy, autocomplete off, click-to-select, readonly/disabled states
    </mat-card-subtitle>

    <mat-card-content class="sto-card__content">
      <div class="demo-grid">
        <!-- Text Input with Custom Title -->
        <mat-form-field [formGroup]="formGroup" stoFormField
                        [title]="customTitle"
                        [disableFormFieldTitle]="disableTitle">
          <mat-label>Text Input (click to select all)</mat-label>
          <input formControlName="textInput" matInput [readonly]="readonly">
          <mat-hint>Custom title: {{customTitle || 'none'}}, Title disabled: {{disableTitle}}</mat-hint>
        </mat-form-field>

        <!-- Single Date Picker -->
        <mat-form-field [formGroup]="formGroup" stoFormField>
          <mat-label>Single Date (formatted in title)</mat-label>
          <input formControlName="singleDate" matInput [matDatepicker]="singlePicker">
          <mat-datepicker-toggle matSuffix [for]="singlePicker"></mat-datepicker-toggle>
          <mat-datepicker #singlePicker></mat-datepicker>
          <mat-hint>Title shows: YYYY-MM-DD format</mat-hint>
        </mat-form-field>

        <!-- Date Range Picker -->
        <mat-form-field class="demo-full-width" [formGroup]="formGroup" stoFormField>
          <mat-label>Date Range (start - end in title)</mat-label>
          <mat-date-range-input formGroupName="dateRange" [rangePicker]="rangePicker">
            <input matStartDate formControlName="start" placeholder="Start date">
            <input matEndDate formControlName="end" placeholder="End date">
          </mat-date-range-input>
          <mat-datepicker-toggle matSuffix [for]="rangePicker"></mat-datepicker-toggle>
          <mat-date-range-picker #rangePicker></mat-date-range-picker>
          <mat-hint>Title shows: start - end dates</mat-hint>
        </mat-form-field>

        <!-- Select Dropdown -->
        <mat-form-field [formGroup]="formGroup" stoFormField>
          <mat-label>Select (trigger value in title)</mat-label>
          <mat-select formControlName="dropdown">
            <mat-option value="Option A">Option A</mat-option>
            <mat-option value="Option B">Option B</mat-option>
            <mat-option value="Option C">Option C</mat-option>
          </mat-select>
          <mat-hint>Title shows selected option</mat-hint>
        </mat-form-field>

        <!-- Multi-select (Array values) -->
        <mat-form-field [formGroup]="formGroup" stoFormField>
          <mat-label>Multi-select (array in title)</mat-label>
          <mat-select formControlName="multiSelect" multiple>
            <mat-option value="Option A">Option A</mat-option>
            <mat-option value="Option B">Option B</mat-option>
            <mat-option value="Option C">Option C</mat-option>
          </mat-select>
          <mat-hint>Title shows: comma-separated values</mat-hint>
        </mat-form-field>

        <!-- Readonly State (always readonly) -->
        <mat-form-field [formGroup]="formGroup" stoFormField>
          <mat-label>Always Readonly (CSS class applied)</mat-label>
          <input formControlName="alwaysReadonly" readonly matInput>
          <mat-hint>Always has .sto-form__field--readonly class</mat-hint>
        </mat-form-field>

        <!-- Disabled State (always disabled) -->
        <mat-form-field [formGroup]="formGroup" stoFormField>
          <mat-label>Always Disabled (CSS class applied)</mat-label>
          <input formControlName="alwaysDisabled" matInput>
          <mat-hint>Always has .sto-form__field--disabled class</mat-hint>
        </mat-form-field>

      <!-- Textarea (no auto-select on click) -->
      <mat-form-field class="demo-full-width" [formGroup]="formGroup" stoFormField>
        <mat-label>Textarea (click doesn't select all)</mat-label>
        <textarea formControlName="textarea" matInput [cdkTextareaAutosize]="true" [readonly]="readonly"></textarea>
        <mat-hint>Click behavior differs from input fields</mat-hint>
      </mat-form-field>      <!-- data-cy Attribute Demo -->
      <mat-form-field [formGroup]="formGroup" stoFormField>
        <mat-label>Named Input (check data-cy attribute)</mat-label>
        <input formControlName="testField" matInput>
        <mat-hint>Has data-cy="testField" for testing</mat-hint>
      </mat-form-field>
      </div>

      <div class="demo-info">
        <strong>Features demonstrated:</strong>
        <ul>
          <li>CSS class: <code>.sto-form__field</code> always applied</li>
          <li>CSS class: <code>.sto-form__field--readonly</code> when readonly</li>
          <li>CSS class: <code>.sto-form__field--disabled</code> when disabled</li>
          <li>Title attribute with formatted values (hover to see)</li>
          <li>data-cy attribute for Cypress testing</li>
          <li>Click-to-select for text inputs (not textareas)</li>
          <li>Autocomplete="off" automatically set</li>
          <li>Custom title override via [title] input</li>
          <li>Disable title via [disableFormFieldTitle] input</li>
        </ul>
      </div>
    </mat-card-content>
  </mat-card>`,
  }),
};

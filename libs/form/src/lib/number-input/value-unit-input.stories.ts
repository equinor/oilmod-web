import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  NumberInputModule,
  NumberUnitInputComponent,
  StoFormModule,
} from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<NumberUnitInputComponent> = {
  title: 'form/Value & Unit input',
  component: NumberUnitInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatIconModule,
        MatFormFieldModule,
        NumberInputModule,
        MatCardModule,
        StoFormModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  argTypes: {
    fractionSize: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Number of decimal places to display',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the unit select read-only',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire input',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required',
    },
    unitOptional: {
      control: 'boolean',
      description: 'Allows clearing the unit selection',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for the value input',
    },
    unitPlaceholder: {
      control: 'text',
      description: 'Placeholder for the unit select',
    },
    unitClearText: {
      control: 'text',
      description: 'Text shown for the clear unit option',
    },
  },
};
export default meta;

type StoryArgs = {
  label: string;
  units: { value: unknown; title?: string }[];
  disabled: boolean;
  required: boolean;
  initialValue: number;
  initialUnit: string;
  fractionSize: number;
  readonly: boolean;
  unitOptional: boolean;
  placeholder: string;
  unitPlaceholder: string;
  unitClearText: string;
};

// Create control outside render to preserve state across re-renders
const sharedControl = new UntypedFormControl({ value: null, unit: null });

export const Usage: StoryObj<StoryArgs> = {
  args: {
    fractionSize: 3,
    label: 'Temperature',
    units: [
      { value: 'C', title: 'C°' },
      { value: 'F', title: 'F°' },
      { value: 'K', title: 'K' },
    ],
    placeholder: 'Enter value',
    unitPlaceholder: 'Select unit',
    readonly: false,
    disabled: false,
    required: false,
    unitOptional: true,
    unitClearText: '(none)',
    initialValue: 32.123,
    initialUnit: 'C',
  },
  argTypes: {
    initialValue: {
      control: 'number',
      description: 'Initial numeric value',
    },
    initialUnit: {
      control: 'text',
      description: 'Initial unit value',
    },
    label: {
      control: 'text',
      description: 'Label for the form field',
    },
    units: {
      control: 'object',
      description: 'Available units for selection',
    },
  },
  render: (args) => {
    // Update validators based on required state
    if (args.required) {
      sharedControl.setValidators(Validators.required);
    } else {
      sharedControl.clearValidators();
    }
    sharedControl.updateValueAndValidity();

    // Update control state based on args (preserving value)
    if (args.disabled) {
      sharedControl.disable({ emitEvent: false });
    } else {
      sharedControl.enable({ emitEvent: false });
    }

    // Set initial value only if control is empty
    if (args.initialValue !== null && sharedControl.value?.value === null) {
      sharedControl.setValue(
        { value: args.initialValue, unit: args.initialUnit },
        { emitEvent: false },
      );
    }

    return {
      props: {
        ...args,
        control: sharedControl,
        change: action('Value changed'),
      },
      template: `
<mat-card class="sto-form" style="width: 600px">
  <mat-form-field stoFormField floatLabel="always">
    <mat-label>{{label}}</mat-label>
    <sto-number-unit-input
      (ngModelChange)="change($event)"
      [fractionSize]="fractionSize"
      [list]="units"
      [readonly]="readonly"
      [formControl]="control"
      [unitPlaceholder]="unitPlaceholder"
      [unitClearText]="unitClearText"
      [unitOptional]="unitOptional"
      [placeholder]="placeholder">
    </sto-number-unit-input>
    @if (control.hasError('required')) {
      <mat-error>This field is required</mat-error>
    }
  </mat-form-field>
  <div style="margin-top: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
    <strong>Form Value:</strong> {{control.value | json}}<br>
    <strong>Valid:</strong> {{control.valid}}<br>
    <strong>Touched:</strong> {{control.touched}}<br>
    <strong>Disabled:</strong> {{control.disabled}}
  </div>
</mat-card>`,
    };
  },
};

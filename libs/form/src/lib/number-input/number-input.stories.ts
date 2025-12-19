import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  NumberInputComponent,
  NumberInputModule,
  StoFormModule,
} from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

interface NumberInputStoryArgs {
  fractionSize: number;
  dynamicFractionSize: boolean;
  readonly: boolean;
  disabled: boolean;
  required: boolean;
  placeholder: string;
  label: string;
  suffix: string;
  initialValue: number | null;
}

const meta: Meta<NumberInputStoryArgs> = {
  title: 'form/Number input',
  component: NumberInputComponent,
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
    dynamicFractionSize: {
      control: 'boolean',
      description: 'Allow dynamic decimal places based on input',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    required: {
      control: 'boolean',
      description: 'Makes the field required',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    suffix: {
      control: 'text',
      description: 'Suffix to display after the input',
    },
    initialValue: {
      control: { type: 'number' },
      description: 'Initial value for the input',
    },
  },
};
export default meta;

// Create control outside render to preserve state across re-renders
const sharedControl = new UntypedFormControl(null);

export const Usage: StoryObj<NumberInputStoryArgs> = {
  args: {
    fractionSize: 3,
    dynamicFractionSize: false,
    readonly: false,
    disabled: false,
    required: false,
    label: 'Amount',
    placeholder: 'Enter number',
    suffix: '$',
    initialValue: null,
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
    if (args.initialValue !== null && sharedControl.value === null) {
      sharedControl.setValue(args.initialValue, { emitEvent: false });
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
      <sto-number-input
        (ngModelChange)="change($event)"
        [dynamicFractionSize]="dynamicFractionSize"
        [fractionSize]="fractionSize"
        [readonly]="readonly"
        [formControl]="control"
        [placeholder]="placeholder">
      </sto-number-input>
      <span matSuffix>{{ suffix }}</span>
      @if (control.hasError('required')) {
        <mat-error>This field is required</mat-error>
      }
    </mat-form-field>
    <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
      <strong>Current value:</strong> {{control.value | json}}
    </div>
    <div style="margin-top: 8px; font-size: 12px; color: #666;">
      <strong>Features to test:</strong>
      <ul style="margin: 4px 0;">
        <li>Type numbers and use comma (,) or period (.) for decimals</li>
        <li>Use arrow up/down keys to increment/decrement integers</li>
        <li>Paste formatted numbers (e.g., "1.234,56" or "1,234.56")</li>
        <li>Negative numbers: type dash (-) at the beginning</li>
        <li>Automatic formatting on blur with thousand separators</li>
        <li>Dynamic fraction size allows trailing decimals</li>
      </ul>
    </div>
  </mat-card>`,
    };
  },
};

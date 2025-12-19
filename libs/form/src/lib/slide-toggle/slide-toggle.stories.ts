import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  SlideToggleComponent,
  SlideToggleModule,
  StoFormModule,
} from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

interface SlideToggleStoryArgs {
  readonly: boolean;
  disabled: boolean;
  required: boolean;
  color: 'primary' | 'accent' | 'warn';
  label: string;
  initialValue: boolean;
}

const meta: Meta<SlideToggleStoryArgs> = {
  title: 'form/Slide toggle',
  component: SlideToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SlideToggleModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatCardModule,
        StoFormModule,
      ],
    }),
  ],
  argTypes: {
    readonly: {
      control: 'boolean',
      description: 'Makes the slide toggle read-only (cannot be changed)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the slide toggle',
    },
    required: {
      control: 'boolean',
      description: 'Makes the field required for form validation',
    },
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
      description: 'Theme color palette for the slide toggle',
    },
    label: {
      control: 'text',
      description: 'Label text for the form field',
    },
    initialValue: {
      control: 'boolean',
      description: 'Initial checked state of the toggle',
    },
  },
};
export default meta;

// Create control outside render to preserve state across re-renders
const sharedControl = new UntypedFormControl(false);
let lastInitialValue: boolean | undefined = undefined;

export const Usage: StoryObj<SlideToggleStoryArgs> = {
  args: {
    readonly: false,
    disabled: false,
    required: false,
    color: 'primary',
    label: 'Enable notifications',
    initialValue: false,
  },
  render: (args) => {
    // Update validators based on required state
    if (args.required) {
      sharedControl.setValidators(Validators.requiredTrue);
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

    // Set initial value only when initialValue control actually changes
    if (lastInitialValue !== args.initialValue) {
      sharedControl.setValue(args.initialValue, { emitEvent: false });
      lastInitialValue = args.initialValue;
    }

    return {
      props: {
        ...args,
        control: sharedControl,
        toggled: (event: unknown) => {
          action('Toggled')(event);
        },
        valueChange: action('Value changed'),
      },
      template: `
<mat-card style="width: 500px" class="sto-form">
  <mat-form-field stoFormField floatLabel="always">
    <mat-label>{{ label }}</mat-label>
    <sto-slide-toggle
      (toggled)="toggled($event)"
      (ngModelChange)="valueChange($event)"
      [color]="color"
      [readonly]="readonly"
      [required]="required"
      [formControl]="control">
    </sto-slide-toggle>
    @if (control.hasError('required')) {
      <mat-error>This toggle must be enabled</mat-error>
    }
  </mat-form-field>

  <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
    <strong>Current value:</strong> {{ control.value }}
  </div>

  <div style="margin-top: 8px; padding: 12px; background: #e8f4f8; border-radius: 4px;">
    <strong>Control state:</strong>
    <ul style="margin: 4px 0; font-size: 13px;">
      <li>Valid: {{ control.valid }}</li>
      <li>Touched: {{ control.touched }}</li>
      <li>Dirty: {{ control.dirty }}</li>
      <li>Disabled: {{ control.disabled }}</li>
    </ul>
  </div>

  <div style="margin-top: 8px; font-size: 12px; color: #666;">
    <strong>Features to test:</strong>
    <ul style="margin: 4px 0;">
      <li>Click the toggle to change value</li>
      <li>Click the label area to toggle (onContainerClick)</li>
      <li>Use 'disabled' control to disable interaction</li>
      <li>Use 'readonly' control to prevent changes (visual difference from disabled)</li>
      <li>Use 'required' control to enable validation</li>
      <li>Test different color themes (primary, accent, warn)</li>
      <li>Integration with Angular reactive forms (FormControl)</li>
    </ul>
  </div>
</mat-card>`,
    };
  },
};

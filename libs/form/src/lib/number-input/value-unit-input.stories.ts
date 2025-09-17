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

const meta: Meta<any> = {
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
};
export default meta;

const control = new UntypedFormControl(
  { value: 32.123, unit: 'C' },
  Validators.required,
);

export const Usage: StoryObj = {
  args: {
    fractionSize: 3,
    label: 'Value Unit Input',
    units: [
      { value: 'C', title: 'C°' },
      { value: 'F', title: 'F°' },
    ],
    qtyPlaceholder: 'Quantity',
    unitPlaceholder: 'Unit',
    readonly: true,
    unitOptional: true,
    unitClearText: '(none)',
  },
  render: (args) => ({
    component: NumberUnitInputComponent,
    props: {
      ...args,
      control,
      change: action('Value changed'),
    },
    template: `
<mat-card class="sto-form" style="width: 600px">
  <button (click)="control.disabled ? control.enable() : control.disable()">Toggle disabled</button><br>
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>{{label}}</mat-label>
      <sto-number-unit-input (ngModelChange)="change($event)"
      [fractionSize]="fractionSize"
      [list]="units"
      [readonly]="readonly"
      [formControl]="control"
      [unitPlaceholder]="unitPlaceholder"
      [unitClearText]="unitClearText"
      [unitOptional]="unitOptional"
      [placeholder]="placeholder">
      </sto-number-unit-input>
    </mat-form-field><br>
    {{control.value | json}}
  </mat-card>`,
  }),
};

import {
  AbstractControl,
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

const meta: Meta<any> = {
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
};
export default meta;

export const Usage: StoryObj = {
  args: {
    fractionSize: 3,
    dynamicFractionSize: false,
    label: 'Label',
    placeholder: 'Placeholder',
    suffix: '$',
  },
  render: (args) => ({
    component: NumberInputComponent,
    props: {
      ...args,
      change: action('Value changed'),
      control: new UntypedFormControl(null, Validators.required),
      toggleValidator: (ctrl: AbstractControl) => {
        if (ctrl.validator) {
          ctrl.clearValidators();
        } else {
          ctrl.setValidators(Validators.required);
        }
        ctrl.updateValueAndValidity();
      },
    },
    template: `
  <mat-card class="sto-form" style="width: 600px">
  <button (click)="control.disabled ? control.enable() : control.disable()">Toggle disabled</button><br>
  <button (click)="toggleValidator(control)">Toggle validator</button><br>
  <button (click)="control.markAsTouched()">Touched</button><br>
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>{{label}}</mat-label>
      <sto-number-input (ngModelChange)="change($event)"
            [dynamicFractionSize]="dynamicFractionSize"
                        [fractionSize]="fractionSize"
                        [readonly]="readonly"
                        [formControl]="control"
                        [placeholder]="placeholder">
      </sto-number-input>
      <span matSuffix>{{ suffix }}</span>
      <mat-error *ngIf="control.hasError('required')">{{ control.getError('required') }}</mat-error>
    </mat-form-field><br>
    {{control.value}}
  </mat-card>`,
  }),
};

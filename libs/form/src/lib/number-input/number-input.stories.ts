import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { MatIconModule } from '@angular/material/icon';
import { NumberInputComponent, NumberInputModule, StoFormModule } from '@ngx-stoui/form';

export default {
  title: 'form/Number input',
  component: NumberInputComponent,
  decorators: [
    moduleMetadata({
      imports: [ BrowserAnimationsModule, MatIconModule,
        MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule ],
    })
  ],
} as Meta;

const Template: Story<NumberInputComponent & Record<string, unknown>> = (args) => {
  return {
    component: NumberInputComponent,
    props: {
      ...args,
      change: action('Value changed'),
      control: new FormControl(null, Validators.required),
      toggleValidator: (ctrl: AbstractControl) => {
        if ( ctrl.validator ) {
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
  </mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  fractionSize: 3,
  dynamicFractionSize: false,
  label: 'Label',
  placeholder: 'Placeholder',
  suffix: '$'
};

import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { MatIconModule } from '@angular/material/icon';
import { NumberInputModule, NumberUnitInputComponent, StoFormModule } from '@ngx-stoui/form';

export default {
  title: 'form/Value & Unit input',
  component: NumberUnitInputComponent,
  decorators: [
    moduleMetadata({
      imports: [ BrowserAnimationsModule, MatIconModule,
        MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule ],
    })
  ],
} as Meta;

const control = new FormControl({ value: 32.123, unit: 'C' }, Validators.required);

const Template: Story<NumberUnitInputComponent & Record<string, unknown>> = (args) => {
  return {
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
  </mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  fractionSize: 3,
  label: 'Value Unit Input',
  units: [ { value: 'C', title: 'C°' }, { value: 'F', title: 'F°' } ],
  qtyPlaceholder: 'Quantity',
  unitPlaceholder: 'Unit',
  readonly: true,
  unitOptional: true,
  unitClearText: '(none)'
};

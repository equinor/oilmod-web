import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMonthpickerInput, StoDatepickerModule, StoFormModule } from '../../projects/stoui-form/src/public_api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import monthPickerReadme from '../../projects/stoui-form/src/lib/sto-monthpicker/sto-monthpicker.md';


export default {
  title: 'form/Monthpicker',
  component: MatMonthpickerInput,
  parameters: {
    notes: { markdown: monthPickerReadme }
  },
  decorators: [
    moduleMetadata({
      imports: [ MatNativeDateModule,
        MatCardModule, BrowserAnimationsModule,
        StoDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, StoFormModule ],
    })
  ]
} as Meta;

const Template: Story<any> = (args) => {
  return {
    props: { ctrl: new FormControl() },
    template: `
<h2>This monthpicker is largely deprecated, and should only be used when 100% required</h2><br>
<a href="https://material.angular.io/components/datepicker/examples">Angular Material has an implementation example here</a>

<mat-card class="sto-form" style="width: 200px">
<mat-form-field class="sto-form__field" [stoMonthFormFieldClick]="picker">
<mat-label>Month</mat-label>
<input matInput [formControl]="ctrl" [mdMonthpicker]="picker">
<md-monthpicker-toggle matSuffix [for]="picker"></md-monthpicker-toggle>
<md-monthpicker #picker></md-monthpicker>
</mat-form-field>
</mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {};

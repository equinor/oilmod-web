import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SlideToggleComponent, SlideToggleModule, StoFormModule } from '../../projects/stoui-form/src/public_api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';

export default {
  title: 'form/Slide toggle',
  component: SlideToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [ SlideToggleModule, MatFormFieldModule, ReactiveFormsModule, BrowserAnimationsModule, MatCardModule, StoFormModule ],
    })
  ],
} as Meta;

const Template: Story<SlideToggleComponent> = (args) => {
  return {
    component: SlideToggleComponent,
    props: {
      ...args,
      ctrl: new FormControl(true),
      valueChange: action('Value changed'),
    },
    template: `
<mat-card style="width: 300px" class="sto-form">
  <button (click)="ctrl.disabled ? ctrl.enable() : ctrl.disable()">Toggle disabled</button><br>
<mat-form-field stoFormField floatLabel="always">
    <mat-label>Slide toggle</mat-label>
    <sto-slide-toggle [color]="color" [readonly]="readonly" [formControl]="ctrl" (ngModelChange)="valueChange($event)"></sto-slide-toggle>
</mat-form-field>
</mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  readonly: false,
  color: 'primary',
};
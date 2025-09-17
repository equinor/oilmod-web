import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
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

const meta: Meta<SlideToggleComponent> = {
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
};
export default meta;

const ctrl = new UntypedFormControl(true);
export const setEnabled = (flag: boolean) => {
  if (flag) {
    ctrl.disable();
  } else {
    ctrl.enable();
  }
  console.log('Component is enabled', ctrl.enabled);
};
export const Usage: StoryObj<SlideToggleComponent> = {
  args: { readonly: false, color: 'primary' },
  render: (args) => ({
    component: SlideToggleComponent,
    props: {
      ...args,
      ctrl,
      valueChange: action('Value changed'),
      toggled: (event: unknown) => {
        console.log(event);
        action('Toggled event');
      },
      setEnabled,
    },
    template: `
<mat-card style="width: 300px" class="sto-form">
  <button (click)="setEnabled(!ctrl.disabled)">
    Toggle {{ ctrl.disabled ? 'enable' : 'disable' }} state
  </button>
  <br>
  <mat-form-field stoFormField floatLabel="always">
    <mat-label>Slide toggle</mat-label>
    <sto-slide-toggle
      (toggled)="toggled($event)"
      [color]="color"
      [readonly]="readonly"
      [formControl]="ctrl"
      (ngModelChange)="valueChange($event)">
    </sto-slide-toggle>
  </mat-form-field>
</mat-card>`,
  }),
};

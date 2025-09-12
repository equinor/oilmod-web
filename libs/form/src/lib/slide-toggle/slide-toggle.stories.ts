import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
        BrowserAnimationsModule,
        MatCardModule,
        StoFormModule,
      ],
    }),
  ],
};
export default meta;

export const Usage: StoryObj<SlideToggleComponent> = {
  args: { readonly: false, color: 'primary' },
  render: (args) => ({
    component: SlideToggleComponent,
    props: {
      ...args,
      ctrl: new UntypedFormControl(true),
      valueChange: action('Value changed'),
      toggled: (event: unknown) => {
        console.log(event);
        action('Toggled event');
      },
    },
    template: `
<mat-card style="width: 300px" class="sto-form">
  <button (click)="ctrl.disabled ? ctrl.enable() : ctrl.disable()">Toggle disabled</button><br>
<mat-form-field stoFormField floatLabel="always">
    <mat-label>Slide toggle</mat-label>
    <sto-slide-toggle (toggled)="toggled($event)" [color]="color" [readonly]="readonly" [formControl]="ctrl" (ngModelChange)="valueChange($event)"></sto-slide-toggle>
</mat-form-field>
</mat-card>`,
  }),
};

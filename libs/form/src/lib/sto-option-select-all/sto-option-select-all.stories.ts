import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  StoFormModule,
  StoOptionSelectAllComponent,
  StoOptionSelectAllComponentModule,
} from '@ngx-stoui/form';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

export default {
  title: 'form/Select all',
  component: StoOptionSelectAllComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoOptionSelectAllComponentModule,
        ReactiveFormsModule,
        StoFormModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        CommonModule,
        MatCardModule,
      ],
    }),
  ],
} as Meta;

const items = [
  { id: 1, name: 'TEST1', longName: 'LONG TEST1' },
  { id: 2, name: 'TEST2', longName: 'LONG TEST2' },
  { id: 3, name: 'TEST3', longName: 'LONG TEST3' },
  { id: 4, name: 'TEST4', longName: 'LONG TEST4' },
  { id: 5, name: 'TEST5', longName: 'LONG TEST5' },
  { id: 6, name: 'TEST6', longName: 'LONG TEST6' },
  { id: 7, name: 'TEST7', longName: 'LONG TEST7' },
  { id: 8, name: 'TEST8', longName: 'LONG TEST8' },
  { id: 9, name: 'TEST9', longName: 'LONG TEST9' },
  { id: 10, name: 'TEST10', longName: 'LONG TEST10' },
];

export const SelectAllMulti: Story<any> = (args) => ({
  props: {
    selected: [1, 2],
    isFilter: true,
    focusIfNoValue: false,
    items,
    total: items.length,
    valueChange: (event: any) => console.log(event),
    ctrl: new UntypedFormControl([1, 2]),
  },
  template: `
<mat-card style="width: 300px" class="sto-form" >
  <mat-form-field stoFormField
                  floatLabel="always" >
    <mat-label>Multiselect with filter</mat-label>
    <mat-select [multiple]="true"
    [formControl]="ctrl"
                (selectionChange)="valueChange($event)"
                [value]="selected">
      <sto-option-select-all></sto-option-select-all>
      <mat-option *ngFor="let opt of items"
                  [value]="opt.id">{{opt.name}}</mat-option>
    </mat-select>
  </mat-form-field>
</mat-card>`,
});

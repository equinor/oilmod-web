import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  StoFormModule,
  StoSelectFilterComponent,
  StoSelectFilterModule,
} from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<StoSelectFilterComponent> = {
  title: 'form/Select filter',
  component: StoSelectFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoSelectFilterModule,
        StoFormModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        MatCardModule,
      ],
    }),
  ],
  argTypes: {},
};
export default meta;

export const SingleSelect: StoryObj = {
  args: {},
  render: (args) => ({
    props: { ...args },
    template: `
<mat-card style="width: 300px" class="sto-form" >
    <mat-form-field  class="sto-form__field" floatLabel="always">
    <mat-label>Select with filter</mat-label>
      <mat-select [multiple]="false" [value]="selected">
        <sto-select-filter (keydown.space)="$event.stopPropagation()"
                           [isFilter]="isFilter"
                           [focusIfNoValue]="focusIfNoValue"
                           [isMulti]="false"
                           (valueChanges)="filteredItems = filter($event, allItems)"></sto-select-filter>
        <mat-option *ngFor="let opt of filteredItems"
                    [value]="opt">{{opt.name}}</mat-option>
      </mat-select>
    </mat-form-field>
</mat-card>`,
  }),
};

export const MultiSelect: StoryObj = {
  args: {},
  render: (args) => ({
    props: { ...args },
    template: `
<mat-card style="width: 300px" class="sto-form" >
  <mat-form-field class="sto-form__field"
                  floatLabel="always" >
    <mat-label>Multiselect with filter</mat-label>
    <mat-select [multiple]="true"
                (selectionChange)="valueChange($event)"
                [value]="selected">
      <sto-select-filter (keydown.space)="$event.stopPropagation()"
                         [selected]="select?.length"
                         [isFilter]="true"
                         [focusIfNoValue]="focusIfNoValue"
                         [isMulti]="true"
                         (valueChanges)="filteredItems = filter($event, allItems)"
                         (selectAll)="selected = $event ? filteredItems :[]; selectAll($event)"></sto-select-filter>
      <mat-option *ngFor="let opt of filteredItems"
                  [value]="opt">{{opt.name}}</mat-option>
    </mat-select>
  </mat-form-field>
</mat-card>`,
  }),
};

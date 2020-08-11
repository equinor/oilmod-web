import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { StoFormModule, StoSelectFilterComponent, StoSelectFilterModule } from '../../projects/stoui-form/src/public_api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { items } from './item-list';

export default {
  title: 'form/Select filter',
  component: StoSelectFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [ StoSelectFilterModule, StoFormModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule, CommonModule, MatCardModule ],
    })
  ],
} as Meta;

const Template: Story<StoSelectFilterComponent> = (args) => {
  return {
    component: StoSelectFilterComponent,
    props: {
      ...args,
      valueChange: action('Value changed'),
      selectAll: action('Select all'),
    },
    template: `
<mat-card style="width: 300px" class="sto-form" (click)="flip()">
<mat-form-field *ngIf="multi" class="sto-form__field" floatLabel="always" >
<mat-label>Multiselect with filter</mat-label>
  <mat-select [multiple]="true" [value]="selected">
    <sto-select-filter (keydown.space)="$event.stopPropagation()" [isFilter]="true" [isMulti]="true" (valueChanges)="filteredItems = filter($event, allItems)"
    (selectAll)="selected = $event ? filteredItems :[]; selectAll($event)"></sto-select-filter>
    <mat-option *ngFor="let opt of filteredItems" [value]="opt">{{opt.name}}</mat-option>
</mat-select>
</mat-form-field>

<mat-form-field *ngIf="!multi" class="sto-form__field" floatLabel="always">
<mat-label>Select with filter</mat-label>
  <mat-select [multiple]="false" [value]="selected">
    <sto-select-filter (keydown.space)="$event.stopPropagation()" [isFilter]="true" [isMulti]="false" (valueChanges)="filteredItems = filter($event, allItems)"
    (selectAll)="selected = $event ? filteredItems :[]; selectAll($event)"></sto-select-filter>
    <mat-option *ngFor="let opt of filteredItems" [value]="opt">{{opt.name}}</mat-option>
</mat-select>
</mat-form-field>
</mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  filter: (event, all) => {
    const re = new RegExp(event || '');
    return all.filter(el => re.test(el.name));
  },
  selected: [],
  multi: false,
  filteredItems: items,
  allItems: items
};

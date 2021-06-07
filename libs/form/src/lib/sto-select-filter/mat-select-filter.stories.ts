import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { items } from './item-list';
import { StoFormModule, StoSelectFilterComponent, StoSelectFilterModule } from '@ngx-stoui/form';

export default {
  title: 'form/Select filter',
  component: StoSelectFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [ StoSelectFilterModule,
        StoFormModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule, CommonModule, MatCardModule ],
    })
  ],
  argTypes: {
    filteredItems: { table: { disable: true } },
    allItems: { table: { disable: true } },
    selected: { control: { disable: true } },
    total: { control: { disable: true } },
    isFilter: { control: { disable: true } },
    value: { control: { disable: true } },
    isMulti: { control: { disable: true } }
  }
} as Meta;

export const SingleSelect: Story<Record<string, unknown>> = (args) => ( {
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
</mat-card>`
} );
SingleSelect.args = {
  filter: (event: any, all: any[]) => {
    const re = new RegExp(event || '');
    return all.filter(el => re.test(el.name));
  },
  isFilter: true,
  focusIfNoValue: false,
  filteredItems: [ ...items ],
  allItems: [ ...items ],
  total: items.length,
  valueChange: action('Value changed'),
  selectAll: action('Select all'),
};

export const MultiSelect: Story<any> = (args) => ( {
  props: { ...args }, template: `
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
</mat-card>`
} );
MultiSelect.args = {
  filter: (event: any, all: any[]) => {
    const re = new RegExp(event || '');
    return all.filter(el => re.test(el.name));
  },
  selectAll: (selectAll: boolean) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.filteredItems = selectAll ? [ ...items ] : [];
    action('Select all')(selectAll);
  },
  selected: [],
  isFilter: true,
  focusIfNoValue: false,
  filteredItems: [ ...items ],
  allItems: [ ...items ],
  total: items.length,
  valueChange: action('Value changed'),
};

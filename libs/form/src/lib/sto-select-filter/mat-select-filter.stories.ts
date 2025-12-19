import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StoFormModule, StoSelectFilterComponent } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

type StoryArgs = {
  itemCount: number;
  disabled: boolean;
};

type Item = { id: number; name: string };

const meta: Meta<StoryArgs> = {
  title: 'form/Select filter',
  component: StoSelectFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoSelectFilterComponent,
        StoFormModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        CommonModule,
        MatCardModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  argTypes: {
    itemCount: {
      control: { type: 'number', min: 3, max: 50, step: 1 },
      description: 'Number of items in the list',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
  },
  args: {
    itemCount: 20,
    disabled: false,
  },
};
export default meta;

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

export const Interactive: StoryObj<StoryArgs> = {
  render: (args) => {
    const allItems = generateItems(args.itemCount);
    const singleCtrl = new FormControl<Item | null>({
      value: null,
      disabled: args.disabled,
    });
    const multiCtrl = new FormControl<Item[]>({
      value: [],
      disabled: args.disabled,
    });
    const singleNoFilterCtrl = new FormControl<Item | null>({
      value: null,
      disabled: args.disabled,
    });
    const multiNoFilterCtrl = new FormControl<Item[]>({
      value: [],
      disabled: args.disabled,
    });

    return {
      props: {
        allItems,
        singleFilteredItems: allItems,
        multiFilteredItems: allItems,
        singleCtrl,
        multiCtrl,
        singleNoFilterCtrl,
        multiNoFilterCtrl,
        getSingleDisplay: () => {
          return (singleCtrl.value as any)?.name || 'None';
        },
        getSingleNoFilterDisplay: () => {
          return (singleNoFilterCtrl.value as any)?.name || 'None';
        },
        getMultiSelectedNames: () => {
          const value = multiCtrl.value as any[];
          if (!value || !Array.isArray(value) || value.length === 0)
            return 'None';
          return value.map((v: any) => v.name).join(', ');
        },
        getMultiNoFilterSelectedNames: () => {
          const value = multiNoFilterCtrl.value as any[];
          if (!value || !Array.isArray(value) || value.length === 0)
            return 'None';
          return value.map((v: any) => v.name).join(', ');
        },
        getMultiDisplay: () => {
          return (multiCtrl.value as any[])?.length || 0;
        },
        getMultiNoFilterDisplay: () => {
          return (multiNoFilterCtrl.value as any[])?.length || 0;
        },
        onSingleFilterChange: (searchText: string, propsRef: any) => {
          propsRef.singleFilteredItems = searchText
            ? allItems.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase()),
              )
            : allItems;
        },
        onMultiFilterChange: (searchText: string, propsRef: any) => {
          propsRef.multiFilteredItems = searchText
            ? allItems.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase()),
              )
            : allItems;
        },
        onSelectAll: (isAllSelected: boolean, propsRef: any) => {
          multiCtrl.setValue(isAllSelected ? propsRef.multiFilteredItems : []);
        },
        onSelectAllNoFilter: (isAllSelected: boolean) => {
          multiNoFilterCtrl.setValue(isAllSelected ? allItems : []);
        },
      },
      template: `
<div style="display: flex; gap: 24px; flex-wrap: wrap;">
  <mat-card style="width: 350px" class="sto-form">
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>Single select with filter</mat-label>
      <mat-select
        [formControl]="singleCtrl"
        (keydown.space)="$event.stopPropagation()">
        <sto-select-filter
          [isFilter]="true"
          [isMulti]="false"
          [focusIfNoValue]="true"
          (keydown.space)="$event.stopPropagation()"
          (valueChanges)="onSingleFilterChange($event, this)"
        ></sto-select-filter>
        @for (item of singleFilteredItems; track item.id) {
          <mat-option [value]="item">
            {{ item.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>

    <div style="margin-top: 16px; padding: 8px; background: var(--bg-default); border-radius: 4px;">
      <strong>Selected:</strong> {{ getSingleDisplay() }}
    </div>
  </mat-card>

  <mat-card style="width: 350px" class="sto-form">
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>Multi-select with filter and select-all</mat-label>
      <mat-select
        [formControl]="multiCtrl"
        [multiple]="true"
        (keydown.space)="$event.stopPropagation()">
        <sto-select-filter
          [isFilter]="true"
          [isMulti]="true"
          [focusIfNoValue]="true"
          (keydown.space)="$event.stopPropagation()"
          (valueChanges)="onMultiFilterChange($event, this)"
          (selectAll)="onSelectAll($event, this)"
        ></sto-select-filter>
        @for (item of multiFilteredItems; track item.id) {
          <mat-option [value]="item">
            {{ item.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>

    <div style="margin-top: 16px; padding: 8px; background: var(--bg-default); border-radius: 4px;">
      <strong>Selected:</strong> {{ getMultiDisplay() }}
      <br/>
      <small style="color: var(--text-secondary);">{{ getMultiSelectedNames() }}</small>
    </div>
  </mat-card>

  <mat-card style="width: 350px" class="sto-form">
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>Single select (no filter, no select-all)</mat-label>
      <mat-select [formControl]="singleNoFilterCtrl">
        <sto-select-filter
          [isFilter]="false"
          [isMulti]="false"
        ></sto-select-filter>
        @for (item of allItems; track item.id) {
          <mat-option [value]="item">
            {{ item.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>

    <div style="margin-top: 16px; padding: 8px; background: var(--bg-default); border-radius: 4px;">
      <strong>Selected:</strong> {{ getSingleNoFilterDisplay() }}
    </div>
  </mat-card>

  <mat-card style="width: 350px" class="sto-form">
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>Multi-select with select-all only (no filter)</mat-label>
      <mat-select
        [formControl]="multiNoFilterCtrl"
        [multiple]="true">
        <sto-select-filter
          [isFilter]="false"
          [isMulti]="true"
          (selectAll)="onSelectAllNoFilter($event)"
        ></sto-select-filter>
        @for (item of allItems; track item.id) {
          <mat-option [value]="item">
            {{ item.name }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>

    <div style="margin-top: 16px; padding: 8px; background: var(--bg-default); border-radius: 4px;">
      <strong>Selected:</strong> {{ getMultiNoFilterDisplay() }}
      <br/>
      <small style="color: var(--text-secondary);">{{ getMultiNoFilterSelectedNames() }}</small>
    </div>
  </mat-card>
</div>`,
    };
  },
};

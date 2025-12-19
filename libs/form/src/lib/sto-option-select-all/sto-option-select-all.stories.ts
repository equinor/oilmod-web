import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StoFormModule, StoOptionSelectAllComponent } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

type StoryArgs = {
  itemCount: number;
  disabled: boolean;
};

const meta: Meta<StoryArgs> = {
  title: 'form/Option Select all',
  component: StoOptionSelectAllComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoOptionSelectAllComponent,
        ReactiveFormsModule,
        StoFormModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        MatCardModule,
      ],
    }),
  ],
  argTypes: {
    itemCount: {
      control: { type: 'number', min: 3, max: 20, step: 1 },
      description: 'Number of items in the list',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
  },
  args: {
    itemCount: 10,
    disabled: false,
  },
};
export default meta;

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `TEST${i + 1}`,
    longName: `LONG TEST${i + 1}`,
  }));

// Maintain form control state across re-renders
let persistedCtrl: UntypedFormControl | null = null;
let lastItemCount = 10;

export const Interactive: StoryObj<StoryArgs> = {
  render: (args) => {
    const items = generateItems(args.itemCount);

    // Reset control if itemCount changed or first render
    if (!persistedCtrl || lastItemCount !== args.itemCount) {
      // Start with indeterminate state (some items selected)
      persistedCtrl = new UntypedFormControl([1, 2]);
      lastItemCount = args.itemCount;
    }

    // Update disabled state without recreating control
    if (args.disabled) {
      persistedCtrl.disable();
    } else {
      persistedCtrl.enable();
    }

    return {
      props: {
        items,
        ctrl: persistedCtrl,
        valueChange: (event: any) =>
          console.log('Selection changed:', event.value),
      },
      template: `
<mat-card style="width: 300px" class="sto-form">
  <mat-form-field stoFormField floatLabel="always">
    <mat-label>Multiselect with Select All</mat-label>
    <mat-select
      [multiple]="true"
      [formControl]="ctrl"
      (selectionChange)="valueChange($event)">
      <sto-option-select-all></sto-option-select-all>
      @for (opt of items; track opt.id) {
        <mat-option [value]="opt.id">
          {{opt.name}}
        </mat-option>
      }
    </mat-select>
  </mat-form-field>

  <div style="margin-top: 16px; padding: 8px; background: var(--bg-default); border-radius: 4px;">
    <strong>Selected:</strong> {{ctrl.value?.length || 0}} / {{items.length}}
    <br/>
    <small style="color: var(--text-secondary);">{{ctrl.value?.join(', ') || 'None'}}</small>
  </div>
</mat-card>`,
    };
  },
};

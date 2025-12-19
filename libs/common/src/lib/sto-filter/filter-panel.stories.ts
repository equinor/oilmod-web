import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // @ts-ignore
import {
  StoFilterPanelComponent,
  StoFilterPanelModule,
} from '@ngx-stoui/common';

import { StoFormModule } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<StoFilterPanelComponent & { title?: string }> = {
  title: 'common/Filter Panel',
  component: StoFilterPanelComponent,
  decorators: [
    moduleMetadata({
      imports: [
    StoFilterPanelModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    StoFormModule,
],
    }),
  ],
  argTypes: {
    filterList: {
      control: 'object',
      description: 'List of active filters displayed as chips in the header',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Filter panel with title, table actions, filter actions, and filter chips. Supports expandable/collapsible content.',
      },
    },
  },
};
export default meta;

type StoryType = StoryObj<StoFilterPanelComponent & { title?: string }>;

/**
 * Complete showcase of all filter panel features:
 * - Custom title
 * - Table actions (left side buttons)
 * - Filter actions (right side buttons before expand toggle)
 * - Active filter chips (shown when collapsed)
 * - Expandable/collapsible form content
 * - Toggle controls for expandable/expanded states
 */
export const Complete: StoryType = {
  args: {
    expanded: true,
    expandable: true,
    title: 'Filter Panel',
    filterList: [
      { key: 'field1', value: 'Active Filter 1', index: 0 },
      { key: 'field2', value: 'Filter 2', index: 1 },
    ],
  },
  render: (args) => ({
    component: StoFilterPanelComponent,
    props: {
      ...args,
      clearFilter: (event: { key: string; index?: number }) => {
        console.log('Clear filter:', event);
      },
      toggled: (event: { isExpanded: boolean; contentHeight: number }) => {
        console.log('Panel toggled:', event);
      },
    },
    template: `
      <sto-filter-panel
        class="sto-form"
        [expandable]="expandable"
        [expanded]="expanded"
        [filterList]="filterList"
        (clearFilter)="clearFilter($event)"
        (toggled)="toggled($event)">

        <!-- Custom title -->
        <sto-filter-title>{{ title }}</sto-filter-title>

        <!-- Table actions (left side) -->
        <sto-filter-table-actions>
          <button matIconButton title="Add new">
            <mat-icon>add</mat-icon>
          </button>
          <button matIconButton title="Export">
            <mat-icon>download</mat-icon>
          </button>
        </sto-filter-table-actions>

        <!-- Filter actions (right side, before expand button) -->
        <sto-filter-actions>
          <button matIconButton title="Clear all filters">
            <mat-icon>clear_all</mat-icon>
          </button>
        </sto-filter-actions>

        <!-- Filter form content -->
        <div class="sto-form" stoGrid>
          <mat-form-field floatLabel="always" stoFormField stoGridColumn>
            <mat-label>Search</mat-label>
            <input matInput placeholder="Enter search term">
          </mat-form-field>

          <mat-form-field floatLabel="always" stoFormField stoGridColumn>
            <mat-label>Category</mat-label>
            <mat-select [multiple]="true">
              <mat-option [value]="1">Category 1</mat-option>
              <mat-option [value]="2">Category 2</mat-option>
              <mat-option [value]="3">Category 3</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field floatLabel="always" stoFormField stoGridColumn>
            <mat-label>Status</mat-label>
            <mat-select>
              <mat-option [value]="'active'">Active</mat-option>
              <mat-option [value]="'inactive'">Inactive</mat-option>
            </mat-select>
          </mat-form-field>

          <div stoGridColumn [stoGridColumnDouble]="true" stoGridSpacer></div>
        </div>
      </sto-filter-panel>

      <div style="margin-top: 16px; padding: 16px; background: var(--surface-container); border-radius: 4px;">
        <p><strong>Try these interactions:</strong></p>
        <ul>
          <li>Click title or filter icon to expand/collapse</li>
          <li>Click filter chips (when collapsed) to remove them</li>
          <li>Toggle "expandable" and "expanded" controls</li>
          <li>Check browser console for event outputs</li>
        </ul>
      </div>`,
  }),
};

/**
 * Non-expandable variant - panel is always collapsed with no expand button.
 * Useful when you only need the header actions without a filter form.
 */
export const NonExpandable: StoryType = {
  args: {
    expandable: false,
    title: 'Actions Only',
  },
  render: (args) => ({
    component: StoFilterPanelComponent,
    props: args,
    template: `
      <sto-filter-panel
        [expandable]="expandable">
        <sto-filter-title>{{ title }}</sto-filter-title>
        <sto-filter-table-actions>
          <button matIconButton>
            <mat-icon>add</mat-icon>
          </button>
          <button matIconButton>
            <mat-icon>download</mat-icon>
          </button>
        </sto-filter-table-actions>
      </sto-filter-panel>`,
  }),
};

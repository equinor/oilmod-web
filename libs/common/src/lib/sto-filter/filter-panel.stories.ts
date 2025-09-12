import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // @ts-ignore
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  StoFilterPanelComponent,
  StoFilterPanelModule,
} from '@ngx-stoui/common';
import { StoDirectivesModule } from '@ngx-stoui/core';
import { StoFormModule } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<StoFilterPanelComponent & { title?: string }> = {
  title: 'common/Filter Panel',
  component: StoFilterPanelComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoFilterPanelModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        StoDirectivesModule,
        MatSelectModule,
        StoFormModule,
      ],
    }),
  ],
  argTypes: { filterList: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        component:
          'Filter panel with title, table actions and filter actions supporting expandable/collapsible content.',
      },
    },
  },
};
export default meta;

type StoryType = StoryObj<
  StoFilterPanelComponent & { title?: string; toggled?: () => void }
>;
export const FilterPanel: StoryType = {
  args: {
    toggled: action('Toggled') as any,
    expanded: true,
    expandable: true,
    title: 'Filter title',
  },
  render: (args) => ({
    component: StoFilterPanelComponent,
    props: args,
    template: `
      <sto-filter-panel class="sto-form"
                        [expandable]="expandable"
                        [expanded]="expanded"
                        (toggled)="toggled()">
          <sto-filter-title>{{ title }}</sto-filter-title>
          <sto-filter-table-actions>
              <button mat-icon-button>
                  <mat-icon>add</mat-icon>
              </button>
          </sto-filter-table-actions>
          <div class="sto-form"
               stoGrid>
              <mat-form-field floatLabel="always"
              stoFormField
                              stoGridColumn>
                  <mat-label>Field 1</mat-label>
                  <input matInput>
              </mat-form-field>
              <mat-form-field floatLabel="always"
              stoFormField
                              stoGridColumn>
                  <mat-label>Field 2 (multi)</mat-label>
                  <mat-select [multiple]="true">
                      <mat-option [value]="1">{{1}}</mat-option>
                      <mat-option [value]="2">{{2}}</mat-option>
                      <mat-option [value]="3">{{3}}</mat-option>
                      <mat-option [value]="4">{{4}}</mat-option>
                  </mat-select>
              </mat-form-field>
              <div stoGridColumn
                   [stoGridColumnDouble]="true"
                   stoGridSpacer></div>
          </div>
      </sto-filter-panel>`,
  }),
};

import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'; // @ts-ignore
import markdown from './sto-filter-panel.component.md';
import { StoFilterPanelComponent, StoFilterPanelModule } from '@ngx-stoui/common';
import { StoDirectivesModule } from '@ngx-stoui/core';
import { StoFormModule } from '@ngx-stoui/form';

export default {
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
        StoFormModule
      ],
    })
  ],
  argTypes: {
    filterList: { table: { disable: true } }
  },
  parameters: {
    notes: { markdown }
  },
} as Meta;

const Template: Story<StoFilterPanelComponent & { title?: string }> = (args: StoFilterPanelComponent) => {
  return {
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
      </sto-filter-panel>`
  };
};

export const FilterPanel = Template.bind({});
FilterPanel.args = {
  toggled: action('Toggled') as any,
  expanded: true,
  expandable: true,
  title: 'Filter title'
};


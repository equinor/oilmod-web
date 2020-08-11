import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoFilterPanelComponent, StoFilterPanelModule } from '../../projects/stoui-common/src/public_api';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StoDirectivesModule } from '../../projects/stoui-core/src/lib/sto-directives/directives.module';
import { MatSelectModule } from '@angular/material/select';
import { StoFormModule } from '../../projects/stoui-form/src/lib/sto-form/sto-form.module';

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
} as Meta;

const Template: Story<StoFilterPanelComponent> = (args: StoFilterPanelComponent) => {
  return {
    component: StoFilterPanelComponent,
    props: args,
    template: `
      <sto-filter-panel [filterList]="filter$ | async"
                        class="sto-form"
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
  toggled: action('Toggled'),
  expanded: true,
  expandable: true,
  title: 'Filter title'
};


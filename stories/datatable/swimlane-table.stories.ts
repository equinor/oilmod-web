import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoDatatableModule } from '../../projects/stoui-datatable/src/public_api';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fixedColumns, rows } from './rows';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';

export default {
  title: 'Datatable/Swimlane',
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule, BrowserAnimationsModule, MatPaginatorModule, MatCardModule,
        NgxDatatableModule
      ],
    })
  ],
} as Meta;

const Template: Story<DatatableComponent> = (args: DatatableComponent) => {
  return {
    props: args,
    template: `<mat-card>
<mat-card-title><h2>This replaces StoComplexDatatable and is only here for CSS</h2></mat-card-title>
<ngx-datatable [loadingIndicator]="loading"
[footerHeight]="40"
[selectionType]="'single'"
[scrollbarV]="true"
[scrollbarH]="horizontalScroll"
[style.height.px]="height"
[rowHeight]="rowHeight"
[headerHeight]="headerHeight"
[class.sto-datatable]="withCss"
[rows]="rows"
[columns]="columns"></ngx-datatable>
</mat-card>`
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {
  select: action('Selection made'),
  contextMenu: action('Context menu'),
  selected: null,
  loading: false,
  horizontalScroll: false,
  withCss: true,
  height: 600,
  rowHeight: 40,
  headerHeight: 36,
  rows,
  columns: fixedColumns.map(c => ( { ...c, width: c.flexBasis } )),
};



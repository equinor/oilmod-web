import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fixedColumns, rows } from './rows';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StoDatatableModule } from '@ngx-stoui/datatable';

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

const Template: Story<Record<string, unknown>> = (args: Record<string, unknown>) => {
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



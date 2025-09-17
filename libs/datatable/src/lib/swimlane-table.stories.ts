import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StoDatatableModule } from '@ngx-stoui/datatable';
import { NgxDatatableModule } from '@ngx-stoui/swimlane-datatable';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { fixedColumns, rows } from './rows';

const meta: Meta<any> = {
  title: 'Datatable/Swimlane',
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatCardModule,
        NgxDatatableModule,
      ],
    }),
  ],
};
export default meta;

type StoryType = StoryObj<Record<string, unknown>>;
export const NormalUse: StoryType = {
  args: {
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
    columns: fixedColumns.map((c) => ({ ...c, width: c.flexBasis })),
  },
  render: (args) => ({
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
</mat-card>`,
  }),
};

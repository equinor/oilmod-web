import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoDatatableComponent, StoDatatableModule } from '../../projects/stoui-datatable/src/public_api';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { columns, rows } from './rows';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'Datatable/StoDatatable/Specific usecases',
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule, BrowserAnimationsModule, MatPaginatorModule, MatCardModule
      ],
    })
  ],
  argTypes: {
    rows: { table: { disable: true } },
    columns: { table: { disable: true } },
    template: { table: { disable: true } },
    visibleRows: { table: { disable: true } },
  }
} as Meta;

export const ResponsiveMode: Story = (args) => ( {
  props: args,
  template: `
<h3>Responsive mode will make the grid break into a list, allowing for a simpler view</h3>
<div [style.width.px]="emulateSmallElement ? breakpoint - 1 : 1000">
<sto-datatable [virtualScroll]="true"
[responsiveBreakPoint]="breakpoint"
[responsive]="true"
[responsiveView]="responsive"
[height]="400"
[rows]="rows"
[columns]="columns"></sto-datatable>
<ng-template #responsive let-row="row">{{ row | json }}</ng-template>
</div>`
} );
ResponsiveMode.args = {
  emulateSmallElement: false,
  breakpoint: 500,
  columns: columns,
  rows: rows,
};

export const Paging: Story = (args) => ( {
  props: args,
  template: `
<h3>Paging is done by using <a href="https://material.angular.io/components/paginator/overview" target="_blank">mat-paginator</a></h3>
<mat-card class="sto-card" (resize)="resize()">
<sto-datatable [virtualScroll]="false" [height]="height" [rows]="visibleRows" [columns]="columns">
    <mat-paginator (page)="setPage($event, this); page($event)" [showFirstLastButtons]="true" [length]="rows.length" [hidePageSize]="true" [pageSize]="30" [pageIndex]="activePage"></mat-paginator>
</sto-datatable>
</mat-card>`
} );
Paging.args = {
  activePage: 0,
  page: action('Page change'),
  setPage: (pageEvent, that) => {
    const startAt = pageEvent.pageIndex * 30;
    const endAt = ( pageEvent.pageIndex + 1 ) * 30 - 1;
    that.visibleRows = [ ...rows ].slice(startAt, endAt);
  },
  height: 400,
  rows,
  visibleRows: rows.slice(0, 30),
  columns,
};

export const AutoSize: Story = (args) => ( {
  props: args,
  template: `<h3>Autosize will ensure the table always uses all available height top-down</h3>
<sto-datatable [virtualScroll]="true" [autoSize]="true" [autoSizeOffset]="autosizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>`,
} );
AutoSize.args = {
  rows,
  columns,
  autosizeOffset: 10,
};

export const MultilineFooter: Story<Partial<StoDatatableComponent>> = args => ( {
  props: args,
  template: `<h3>The table takes in a list of footer rows</h3>
<sto-datatable [virtualScroll]="true" [scrollbarH]="true" [autoSize]="true" [footerRow]="footerRow" [autoSizeOffset]="autoSizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>`,
} );
MultilineFooter.args = {
  rows,
  columns: [ ...columns, ...columns, ...columns ],
  footerRow: [ { invoiceNo: 'Import', voyageNo: '9001' }, { invoiceNo: 'Export', voyageNo: '9002' }, {
    invoiceNo: 'Import',
    voyageNo: '9001'
  }, { invoiceNo: 'Export', voyageNo: '9002' }, ],
  autoSizeOffset: 10,
};

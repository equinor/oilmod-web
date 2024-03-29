import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { columns, rows } from './rows';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { StoDatatableComponent, StoDatatableModule } from '@ngx-stoui/datatable';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

export default {
  title: 'Datatable/StoDatatable/Specific usecases',
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule, BrowserAnimationsModule, MatPaginatorModule, MatCardModule, MatIconModule, MatTooltipModule
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
  styles: [
    `.container {
      transition: width 300ms linear;
    }`
  ],
  template: `
<h3>Responsive mode will make the grid break into a list, allowing for a simpler view</h3>
<div class="container" [style.width.px]="emulateSmallElement ? breakpoint - 1 : 1000">
<sto-datatable [virtualScroll]="true"
[responsiveBreakPoint]="breakpoint"
[responsive]="true"
[responsiveView]="responsive"
[height]="400"
[rows]="rows"
[columns]="columns"></sto-datatable>
<ng-template #responsive let-row="row"><span [matTooltip]="row | json">{{ row | json }}</span></ng-template>
</div>`
} );
ResponsiveMode.args = {
  emulateSmallElement: false,
  breakpoint: 500,
  columns,
  rows,
};

export const Paging: Story = (args) => ( {
  props: {
    page: action('Page change'),
    setPage: (pageEvent: { pageIndex: number; }, that: { visibleRows: { total: unknown; invoiceNo: number; voyageNo: number; vesselName: string; allocated: number; }[]; }) => {
      const startAt = pageEvent.pageIndex * 30;
      const endAt = ( pageEvent.pageIndex + 1 ) * 30 - 1;
      that.visibleRows = [ ...rows ].slice(startAt, endAt);
    },
    ...args
  },
  template: `
<h3>Paging is done by using <a href="https://material.angular.io/components/paginator/overview" target="_blank">mat-paginator</a></h3>
<mat-card class="sto-card" (resize)="resize()">
<sto-datatable [sortable]="true" [resizeable]="true" [scrollbarH]="true" [virtualScroll]="false" [height]="height" [rows]="visibleRows" [columns]="columns">
    <mat-paginator (page)="setPage($event, this); page($event)" [showFirstLastButtons]="true" [length]="rows.length" [hidePageSize]="true" [pageSize]="30" [pageIndex]="activePage"></mat-paginator>
</sto-datatable>
</mat-card>`
} );
Paging.args = {
  activePage: 0,
  height: 400,
  rows,
  visibleRows: rows.slice(0, 30),
  columns,
};

export const AutoSize: Story = (args) => ( {
  props: args,
  template: `<h3>Autosize will ensure the table always uses all available height top-down</h3>
<sto-datatable [virtualScroll]="true" [autoSize]="true" [autoSizeOffset]="autosizeOffset" [height]="height" [rows]="rows" [columns]="columns">
</sto-datatable>`,
} );
AutoSize.args = {
  rows,
  columns,
  autosizeOffset: 10,
};

export const MultilineFooter: Story<Partial<StoDatatableComponent<Record<string, unknown>>>> = args => ( {
  props: args,
  template: `<h3>The table takes in a list of footer rows</h3>
<sto-datatable [virtualScroll]="true" [scrollbarH]="false" [autoSize]="true" [footerRow]="footerRow" [autoSizeOffset]="autoSizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>`,
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

export const Actionbar: Story<Partial<StoDatatableComponent<Record<string, unknown>>>> = args => ( {
  props: args,
  template: `<h3>With an actionbar on the top left and right side</h3>
<sto-datatable [virtualScroll]="true" [scrollbarH]="true" [autoSize]="true" [footerRow]="footerRow" [autoSizeOffset]="autoSizeOffset" [height]="height" [rows]="rows" [columns]="columns">
  <sto-datatable-actions>
      <sto-datatable-actions-left>
        <button mat-icon-button><mat-icon>content_copy</mat-icon></button>
        <button mat-icon-button><mat-icon>delete</mat-icon></button>
       </sto-datatable-actions-left>
      <sto-datatable-actions-right>
        <button mat-icon-button><mat-icon>settings</mat-icon></button>
      </sto-datatable-actions-right>
  </sto-datatable-actions>
</sto-datatable>`,
} );
Actionbar.args = {
  rows,
  columns: [ ...columns, ...columns, ...columns ],
  autoSizeOffset: 10,
};


export const Grouped: Story<Partial<StoDatatableComponent<Record<string, unknown>>>> = args => ( {
  props: args,
  template: `<h3>With column groups</h3>
<div >
<sto-datatable [resizeable]="true" [groups]="groups" [virtualScroll]="true" [scrollbarH]="true" [autoSize]="true" [footerRow]="footerRow" [autoSizeOffset]="autoSizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</div>`,
} );
Grouped.args = {
  rows,
  columns: columns.map(c => ( { ...c, flexShrink: 0, flexGrow: 0 } )),
  groups: [
    {
      props: [ 'invoiceNo',
        'voyageNo'
      ], name: 'Invoice & Voyage#'
    },
    {
      props:
        [ 'vesselName',
          'allocated',
        ], name: 'Vessel & Allocated'
    },
    { props: [ 'total' ], name: 'Sum' }
  ],
  autoSizeOffset: 10,
};

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
  component: StoDatatableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule, BrowserAnimationsModule, MatPaginatorModule, MatCardModule
      ],
    })
  ],
} as Meta;

const Template: Story<StoDatatableComponent> = (args: StoDatatableComponent) => {
  return {
    component: null,
    props: args,
    template: args.template ? args.template() : null
  };
};

export const ResponsiveMode = Template.bind({});
ResponsiveMode.args = {
  emulateSmallElement: false,
  breakpoint: 500,
  columns: columns,
  rows: rows,
  template: () => `
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
};

export const Paging = Template.bind({});
Paging.args = {
  activePage: 0,
  page: action('Page change'),
  setPage: (pageEvent, that) => {
    console.log(pageEvent);
    const startAt = pageEvent.pageIndex * 30;
    const endAt = ( pageEvent.pageIndex + 1 ) * 30 - 1;
    that.visibleRows = [ ...rows ].slice(startAt, endAt);
  },
  height: 400,
  rows,
  visibleRows: rows.slice(0, 30),
  columns,
  template: () => `
<h3>Paging is done by using mat-paginator</h3>
<mat-card class="sto-card" (resize)="resize()">
<sto-datatable [virtualScroll]="false" [height]="height" [rows]="visibleRows" [columns]="columns">
    <mat-paginator (page)="setPage($event, this); page($event)" [showFirstLastButtons]="true" [length]="rows.length" [hidePageSize]="true" [pageSize]="30" [pageIndex]="activePage"></mat-paginator>
</sto-datatable>
</mat-card>`
};

export const AutoSize = Template.bind({});
AutoSize.args = {
  rows,
  columns,
  autosizeOffset: 10,
  template: () => `<h3>Autosize will ensure the table always uses all available height top-down</h3>
<sto-datatable [virtualScroll]="true" [autoSize]="true" [autoSizeOffset]="autosizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>`,
};


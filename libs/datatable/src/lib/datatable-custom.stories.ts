import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoDatatableModule } from '@ngx-stoui/datatable';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { columns, rows } from './rows';

// Use generic any to relax strict mismatch with story helper-only fields
const meta: Meta<any> = {
  title: 'Datatable/StoDatatable/Advanced Features',
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
      ],
    }),
  ],
  argTypes: {
    height: { control: 'number' },
    autoSizeOffset: { control: 'number' },
  },
  args: {
    height: 400,
    autoSizeOffset: 10,
  },
};
export default meta;

type StoryType = StoryObj<any>;

export const Responsive: StoryType = {
  args: {
    emulateSmallScreen: false,
    responsiveBreakPoint: 500,
  },
  argTypes: {
    emulateSmallScreen: { control: 'boolean' },
    responsiveBreakPoint: { control: 'number' },
  },
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
    styles: [
      `.container {
      transition: width 300ms linear;
    }`,
    ],
    template: `
<h3>Responsive mode breaks the grid into a list view on small screens</h3>
<div class="container" [style.width]="emulateSmallScreen ? '499px' : '1000px'">
  <sto-datatable
    [virtualScroll]="true"
    [responsiveBreakPoint]="responsiveBreakPoint"
    [responsive]="true"
    [responsiveView]="responsive"
    [height]="height"
    [autoSizeOffset]="autoSizeOffset"
    [rows]="rows"
    [columns]="columns"></sto-datatable>
  <ng-template #responsive let-row="row">
    <span [matTooltip]="row | json">
      {{ row | json }}
    </span>
  </ng-template>
</div>`,
  }),
};

export const WithPagination: StoryType = {
  args: {
    pageSize: 30,
  },
  argTypes: {
    pageSize: { control: 'number' },
  },
  render: (args) => ({
    props: {
      ...args,
      page: action('Page change'),
      setPage: (
        pageEvent: { pageIndex: number },
        that: { visibleRows: any[] },
      ) => {
        const startAt = pageEvent.pageIndex * args.pageSize;
        const endAt = (pageEvent.pageIndex + 1) * args.pageSize;
        that.visibleRows = [...rows].slice(startAt, endAt);
      },
      activePage: 0,
      columns: columns,
      rows: rows,
      visibleRows: [...rows].slice(0, args.pageSize),
    },
    template: `
<h3>Pagination with <a href="https://material.angular.io/components/paginator/overview" target="_blank">mat-paginator</a></h3>
<mat-card class="sto-card">
  <sto-datatable
    [sortable]="true"
    [resizeable]="true"
    [scrollbarH]="true"
    [virtualScroll]="false"
    [height]="height"
    [rows]="visibleRows"
    [columns]="columns">
    <mat-paginator
      (page)="setPage($event, this); page($event)"
      [showFirstLastButtons]="true"
      [length]="rows.length"
      [hidePageSize]="true"
      [pageSize]="pageSize"
      [pageIndex]="activePage">
    </mat-paginator>
  </sto-datatable>
</mat-card>`,
  }),
};

export const WithFooter: StoryType = {
  args: {
    multipleFooters: true,
  },
  argTypes: {
    multipleFooters: { control: 'boolean' },
  },
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      footerRow: args.multipleFooters
        ? [
            {
              invoiceNo: 'Total',
              voyageNo: '',
              vesselName: '',
              allocated: 0,
              total: 0,
            },
            {
              invoiceNo: 'Average',
              voyageNo: '',
              vesselName: '',
              allocated: 0,
              total: 0,
            },
          ]
        : [
            {
              invoiceNo: 'Total',
              voyageNo: '',
              vesselName: '',
              allocated: 0,
              total: 0,
            },
          ],
      trackBy: (index: number) => index,
    },
    template: `
<h3>Footer rows for totals and aggregations</h3>
<sto-datatable
  [virtualScroll]="true"
  [scrollbarH]="false"
  [footerRow]="footerRow"
  [autoSizeOffset]="autoSizeOffset"
  [height]="height"
  [rows]="rows"
  [columns]="columns">
</sto-datatable>`,
  }),
};

export const WithActions: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
    template: `
<h3>Action bar with left and right side buttons</h3>
<sto-datatable
  [virtualScroll]="true"
  [scrollbarH]="true"
  [autoSizeOffset]="autoSizeOffset"
  [height]="height"
  [rows]="rows"
  [columns]="columns">
  <sto-datatable-actions>
    <sto-datatable-actions-left>
      <button matIconButton><mat-icon>content_copy</mat-icon></button>
      <button matIconButton><mat-icon>delete</mat-icon></button>
    </sto-datatable-actions-left>
    <sto-datatable-actions-right>
      <button matIconButton><mat-icon>settings</mat-icon></button>
    </sto-datatable-actions-right>
  </sto-datatable-actions>
</sto-datatable>`,
  }),
};

export const WithColumnGroups: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      groups: [
        { name: 'Invoice Details', props: ['invoiceNo', 'voyageNo'] },
        { name: 'Vessel Information', props: ['vesselName'] },
        { name: 'Financial Data', props: ['allocated', 'total'] },
      ],
    },
    template: `
<h3>Organize columns into logical groups</h3>
<sto-datatable
  [resizeable]="true"
  [groups]="groups"
  [virtualScroll]="true"
  [scrollbarH]="true"
  [autoSizeOffset]="autoSizeOffset"
  [height]="height"
  [rows]="rows"
  [columns]="columns">
</sto-datatable>`,
  }),
};

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
  title: 'Datatable/StoDatatable/Specific usecases',
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
  argTypes: {},
};
export default meta;

type StoryType = StoryObj<any>;

export const ResponsiveMode: StoryType = {
  args: { emulateSmallElement: false, autoSize: false },
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
<h3>Responsive mode will make the grid break into a list, allowing for a simpler view</h3>
<div class="container" [style.width]="emulateSmallElement ? '499px' : autoSize ? 'auto' : '1000px'">
  <sto-datatable
    [virtualScroll]="true"
    [responsiveBreakPoint]="500"
    [responsive]="true"
    [responsiveView]="responsive"
    [height]="400"
    [autoSize]="autoSize"
    [autoSizeOffset]="10"
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

export const Paging: StoryType = {
  render: () => ({
    props: {
      page: action('Page change'),
      setPage: (
        pageEvent: { pageIndex: number },
        that: { visibleRows: any[] },
      ) => {
        const startAt = pageEvent.pageIndex * 30;
        const endAt = (pageEvent.pageIndex + 1) * 30 - 1;
        that.visibleRows = [...rows].slice(startAt, endAt);
      },
      activePage: 0,
    },
    template: `
<h3>
  Paging is done by using
  <a href="https://material.angular.io/components/paginator/overview" target="_blank">
    mat-paginator
  </a>
</h3>
<mat-card class="sto-card" (resize)="resize()">
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
      [pageSize]="30"
      [pageIndex]="activePage">
    </mat-paginator>
  </sto-datatable>
</mat-card>`,
  }),
};

export const AutoSize: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
    template: `
<h3>Autosize will ensure the table always uses all available height top-down</h3>
  <sto-datatable
    [virtualScroll]="true"
    [autoSize]="true"
    [autoSizeOffset]="10"
    [height]="height"
    [rows]="rows"
    [columns]="columns">
</sto-datatable>`,
  }),
};

export const MultilineFooter: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
    template: `
<h3>The table takes in a list of footer rows</h3>
<sto-datatable
  [virtualScroll]="true"
  [scrollbarH]="false"
  [autoSize]="true"
  [footerRow]="footerRow"
  [autoSizeOffset]="10"
  [height]="height"
  [rows]="rows"
  [columns]="columns">
</sto-datatable>`,
  }),
};

export const Actionbar: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
    template: `
<h3>With an actionbar on the top left and right side</h3>
<sto-datatable
  [virtualScroll]="true"
  [scrollbarH]="true"
  [autoSize]="true"
  [footerRow]="footerRow"
  [autoSizeOffset]="10"
  [height]="height"
  [rows]="rows"
  [columns]="columns">
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
  }),
};

export const Grouped: StoryType = {
  render: () => ({
    props: {},
    template: `<h3>With column groups</h3>
<div >
<sto-datatable [resizeable]="true" [groups]="groups" [virtualScroll]="true" [scrollbarH]="true" [autoSize]="true" [footerRow]="footerRow" [autoSizeOffset]="10" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</div>`,
  }),
};

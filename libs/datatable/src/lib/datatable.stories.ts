import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  StoDatatableComponent,
  StoDatatableModule,
} from '@ngx-stoui/datatable';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { columns, rows } from './rows';

const meta: Meta<StoDatatableComponent<Record<string, unknown>>> = {
  title: 'Datatable/StoDatatable',
  component: StoDatatableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoDatatableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatCardModule,
      ],
    }),
  ],
  argTypes: {
    height: { control: 'number' },
    rowHeight: { control: 'number' },
    headerHeight: { control: 'number' },
    sortable: { control: 'boolean' },
    resizeable: { control: 'boolean' },
    scrollbarH: { control: 'boolean' },
    virtualScroll: { control: 'boolean' },
    autoSize: { control: 'boolean' },
    elevation: { control: 'boolean' },
    loading: { control: 'boolean' },
    disableRipple: { control: 'boolean' },
    emptyMessage: { control: 'text' },
  },
  args: {
    height: 400,
    rowHeight: 36,
    headerHeight: 36,
    sortable: true,
    resizeable: true,
    scrollbarH: false,
    virtualScroll: true,
    autoSize: false,
    elevation: true,
    loading: false,
    disableRipple: false,
    emptyMessage: 'No records in set',
  },
};
export default meta;

type StoryType = StoryObj<StoDatatableComponent<Record<string, unknown>>>;

export const Interactive: StoryType = {
  render: (args) => ({
    component: StoDatatableComponent,
    props: {
      ...args,
      columns: (args as any).scrollbarH
        ? [...columns, ...columns, ...columns]
        : columns,
      rows: (args as any).loading ? [] : rows,
      headerContextMenu: action('Header context menu'),
      rowContextMenu: action('Row context menu'),
      rowActivate: action('Keyboard-activation on row'),
      select: action('Row selected'),
      resized: action('Resize'),
      sortChanged: action('Sort changed'),
      trackBy: (index: number) => index,
    },
  }),
};

export const EmptyState: StoryType = {
  args: {
    emptyMessage: 'No data available - try loading some records',
    loading: false,
  },
  render: (args) => ({
    component: StoDatatableComponent,
    props: {
      ...args,
      columns: columns,
      rows: [],
      trackBy: (index: number) => index,
    },
  }),
};

export const LoadingState: StoryType = {
  args: {
    loading: true,
  },
  render: (args) => ({
    component: StoDatatableComponent,
    props: {
      ...args,
      columns: columns,
      rows: rows,
      trackBy: (index: number) => index,
    },
  }),
};

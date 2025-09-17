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
  argTypes: {},
};
export default meta;

type StoryType = StoryObj<StoDatatableComponent<Record<string, unknown>>>;
export const NormalUse: StoryType = {
  render: (args) => ({
    component: StoDatatableComponent,
    props: {
      ...args,
      columns: (args as any).scrollbarH
        ? [...columns, ...columns, ...columns]
        : columns,
      rows: rows,
      headerContextMenu: action('Header context menu'),
      rowContextMenu: action('Row context menu'),
      rowActivate: action('Keyboard-activation on row'),
      select: action('Row selected'),
      resized: action('Resize'),
      trackBy: (index: number) => index,
    },
  }),
};

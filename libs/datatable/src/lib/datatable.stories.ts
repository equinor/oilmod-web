import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { columns, rows } from './rows';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { StoDatatableComponent, StoDatatableModule } from '@ngx-stoui/datatable';

export default {
  title: 'Datatable/StoDatatable',
  component: StoDatatableComponent,
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
    component: { table: { disable: true } },
    headerContextMenu: { table: { disable: true } },
    rowContextMenu: { table: { disable: true } },
    rowActivate: { table: { disable: true } },
    select: { table: { disable: true } },
    resized: { table: { disable: true } },
    columnGroups: { table: { disable: true } },
    columnMode: { table: { disable: true } },
    footerRow: { table: { disable: true } },
    responsiveView: { table: { disable: true } },
    selected: { table: { disable: true } },
    trackBy: { table: { disable: true } },
  }
} as Meta;

export const NormalUse: Story<StoDatatableComponent<Record<string, unknown>>> = (args: StoDatatableComponent<Record<string, unknown>>) => {
  return {
    component: StoDatatableComponent,
    props: {
      ...args, columns: args.scrollbarH ? [ ...columns, ...columns, ...columns ] : columns,
      rows: rows,
      headerContextMenu: action('Header context menu'),
      rowContextMenu: action('Row context menu'),
      rowActivate: action('Keyboard-activation on row'),
      select: action('Row selected'),
      resized: action('Resize'),
      trackBy: (index: number) => index
    },
  };
};

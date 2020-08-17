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

const Template: Story<StoDatatableComponent> = (args: StoDatatableComponent) => {
  return {
    component: StoDatatableComponent,
    props: args,
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {
  columns: columns,
  rows: rows,
  headerContextMenu: action('Header context menu'),
  rowContextMenu: action('Row context menu'),
  rowActivate: action('Keyboard-activation on row'),
  select: action('Row selected'),
  resized: action('Resize')
  // save: action('Save'),
  // cancel: action('Cancel'),
};



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
} as Meta;

const Template: Story<StoDatatableComponent> = (args: StoDatatableComponent) => {
  return {
    component: args.component ? args.component() : null,
    props: args,
    template: args.template ? args.template() : null
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {
  columns: columns,
  rows: rows,
  component: () => StoDatatableComponent,
  headerContextMenu: action('Header context menu'),
  rowContextMenu: action('Row context menu'),
  rowActivate: action('Keyboard-activation on row'),
  select: action('Row selected'),
  resized: action('Resize')
  // save: action('Save'),
  // cancel: action('Cancel'),
};



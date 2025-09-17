import { MatButtonModule } from '@angular/material/button';
import {
  StoActionFooterComponent,
  StoActionFooterModule,
} from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<StoActionFooterComponent> = {
  title: 'common/Action footer',
  component: StoActionFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [StoActionFooterModule, MatButtonModule],
    }),
  ],
  parameters: {},
};
export default meta;

type StoryType = StoryObj<StoActionFooterComponent & { isLoading?: boolean }>;
export const ActionFooter: StoryType = {
  args: {},
  render: (args) => ({
    component: StoActionFooterComponent,
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel'),
    },
    template:
      '<sto-action-footer [isLoading]="isLoading" [position]="position" [shouldAddClass]="shouldAddClass"><button mat-flat-button (click)="save()" color="primary">Save</button><button (click)="cancel()" mat-button>Cancel</button></sto-action-footer>',
  }),
};

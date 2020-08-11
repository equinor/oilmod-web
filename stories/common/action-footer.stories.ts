import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoActionFooterComponent, StoActionFooterModule } from '../../projects/stoui-common/src/public_api';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'common/Action footer',
  component: StoActionFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoActionFooterModule,
        MatButtonModule, BrowserAnimationsModule ],
    })
  ],
} as Meta;

const Template: Story<StoActionFooterComponent> = (args: StoActionFooterComponent) => {
  return {
    component: StoActionFooterComponent,
    props: args,
    template: '<sto-action-footer [isLoading]="isLoading" [position]="position" [shouldAddClass]="shouldAddClass"><button mat-flat-button (click)="save()" color="primary">Save</button><button (click)="cancel()" mat-button>Cancel</button></sto-action-footer>'
  };
};

export const ActionFooter = Template.bind({});
ActionFooter.args = {
  save: action('Save'),
  cancel: action('Cancel'),
};

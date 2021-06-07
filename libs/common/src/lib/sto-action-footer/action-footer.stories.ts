import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoActionFooterComponent, StoActionFooterModule } from '@ngx-stoui/common';

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
  parameters: {
  },
} as Meta;

const Template: Story<StoActionFooterComponent> = (args: StoActionFooterComponent) => {
  return {
    component: StoActionFooterComponent,
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel')
    },
    template: '<sto-action-footer [isLoading]="isLoading" [position]="position" [shouldAddClass]="shouldAddClass"><button mat-flat-button (click)="save()" color="primary">Save</button><button (click)="cancel()" mat-button>Cancel</button></sto-action-footer>'
  };
};

export const ActionFooter = Template.bind({});
ActionFooter.args = {

};

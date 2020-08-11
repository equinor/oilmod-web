import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoMessagePanelComponent, StoMessagePanelModule } from '../../projects/stoui-common/src/public_api';
import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'common/Message panel',
  component: StoMessagePanelComponent,
  decorators: [
    moduleMetadata({
      imports: [ MatIconModule, StoMessagePanelModule ],
    })
  ],
} as Meta;

const Template: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    component: StoMessagePanelComponent,
    props: args,
    template: '<sto-message-panel (dismissed)="dismiss()" [color]="color" [dismissable]="dismissable" [icon]="icon" [severity]="severity">{{ contents }}</sto-message-panel>'
  };
};

export const WithTemplate = Template.bind({});
WithTemplate.args = {
  contents: 'Message panel contents',
  dismiss: action('Dismiss'),
  title: 'Usage',
  // template: '<sto-message-panel (dismissed)="dismiss()" [color]="color" [dismissable]="dismissable" [icon]="icon" [severity]="severity">{{ contents }}</sto-message-panel>'
};

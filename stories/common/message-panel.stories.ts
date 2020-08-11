import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { StoMessagePanelComponent, StoMessagePanelModule } from '../../projects/stoui-common/src/public_api';
import { MatIconModule } from '@angular/material/icon';
import markdown from '../../projects/stoui-common/src/lib/sto-message-panel/sto-message-panel.component.md';

export default {
  title: 'common/Message panel',
  component: StoMessagePanelComponent,
  decorators: [
    moduleMetadata({
      imports: [ MatIconModule, StoMessagePanelModule ],
    })
  ],
  parameters: {
    notes: { markdown }
  },
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
};


export const Primary: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="primary" [dismissable]="false" icon="info">Primary Text Content</sto-message-panel>'
  };
};


export const Warning: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="warning" [dismissable]="false" icon="warning">Warning Text Content</sto-message-panel>'
  };
};


export const Danger: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="danger" [dismissable]="false" icon="error">Danger Text Content (a little to red atm.. :) )</sto-message-panel>'
  };
};


export const Dismissable: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    props: { dismiss: action('Dismissed') },
    template: '<sto-message-panel (dismissed)="dismiss()" [dismissable]="true">Dismissable Text Content</sto-message-panel>'
  };
};

const argTypes = {
  color: { control: { disable: true } },
  dismissable: { control: { disable: true } },
  icon: { control: { disable: true } },
  severity: { control: { disable: true } },
};

Primary.argTypes = argTypes;
Warning.argTypes = argTypes;
Error.argTypes = argTypes;
Dismissable.argTypes = argTypes;

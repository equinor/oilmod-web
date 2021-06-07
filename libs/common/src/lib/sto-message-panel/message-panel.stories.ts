import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
// @ts-ignore
import markdown from './sto-message-panel.component.md';
import { StoMessagePanelComponent, StoMessagePanelModule } from '@ngx-stoui/common';

export default {
  title: 'common/Message panel',
  component: StoMessagePanelComponent,
  decorators: [
    moduleMetadata({
      imports: [ MatIconModule, StoMessagePanelModule ],
    })
  ],
  argTypes: {
    severity: { table: { disable: true } }
  },
  parameters: {
    notes: { markdown }
  },
} as Meta;

const Template: Story<StoMessagePanelComponent & {contents?: string}> = (args: StoMessagePanelComponent) => {
  return {
    component: StoMessagePanelComponent,
    props: { ...args, dismissed: action('Dismissed') },
    template: '<sto-message-panel [color]="color" [dismissable]="dismissable" [icon]="icon" (dismissed)="dismissed()">{{ contents }}</sto-message-panel>'
  };
};

export const UsageWithInput = Template.bind({});
UsageWithInput.args = {
  contents: 'Message panel contents',
  color: 'warning',
  icon: 'warning'
};


export const Primary: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="primary" [dismissable]="false" icon="info">Primary Text Content</sto-message-panel>'
  };
};


export const Accent: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="accent" [dismissable]="false" icon="info">Accent Text Content</sto-message-panel>'
  };
};


export const Warning: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="warning" [dismissable]="false" icon="warning">Warning Text Content</sto-message-panel>'
  };
};

export const Success: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="success" [dismissable]="false" icon="info">Warning Text Content</sto-message-panel>'
  };
};


export const Warn: Story<StoMessagePanelComponent> = (args: StoMessagePanelComponent) => {
  return {
    template: '<sto-message-panel (dismissed)="dismiss()" color="warn" [dismissable]="false" icon="warning">Warn Text Content</sto-message-panel>'
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
Danger.argTypes = argTypes;
Dismissable.argTypes = argTypes;

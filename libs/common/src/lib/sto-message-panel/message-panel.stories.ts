import { MatIconModule } from '@angular/material/icon'; // @ts-ignore
import {
  StoMessagePanelComponent,
  StoMessagePanelModule,
} from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<StoMessagePanelComponent & { contents?: string }> = {
  title: 'common/Message panel',
  component: StoMessagePanelComponent,
  decorators: [
    moduleMetadata({
      imports: [MatIconModule, StoMessagePanelModule],
    }),
  ],
  argTypes: {
    severity: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Message panel for contextual feedback in various severities with optional dismiss.',
      },
    },
  },
};
export default meta;

type StoryType = StoryObj<StoMessagePanelComponent & { contents?: string }>;

export const UsageWithInput: StoryType = {
  args: {
    contents: 'Message panel contents',
    color: 'warning',
    icon: 'warning',
  },
  render: (args) => ({
    component: StoMessagePanelComponent,
    props: { ...args, dismissed: action('Dismissed') },
    template:
      '<sto-message-panel [color]="color" [dismissable]="dismissable" [icon]="icon" (dismissed)="dismissed()">{{ contents }}</sto-message-panel>',
  }),
};

const simple = (color: string, icon: string, text: string): StoryType => ({
  render: () => ({
    template: `<sto-message-panel color="${color}" [dismissable]="false" icon="${icon}">${text}</sto-message-panel>`,
  }),
});

export const Primary: StoryType = simple(
  'primary',
  'info',
  'Primary Text Content',
);
export const Accent: StoryType = simple(
  'accent',
  'info',
  'Accent Text Content',
);
export const Warning: StoryType = simple(
  'warning',
  'warning',
  'Warning Text Content',
);
export const Success: StoryType = simple(
  'success',
  'info',
  'Warning Text Content',
);
export const Warn: StoryType = simple('warn', 'warning', 'Warn Text Content');
export const Danger: StoryType = simple(
  'danger',
  'error',
  'Danger Text Content (a little to red atm.. :) )',
);

export const Dismissable: StoryType = {
  render: () => ({
    props: { dismiss: action('Dismissed') },
    template:
      '<sto-message-panel (dismissed)="dismiss()" [dismissable]="true">Dismissable Text Content</sto-message-panel>',
  }),
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

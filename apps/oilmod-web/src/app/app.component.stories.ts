import type { Meta, StoryObj } from '@storybook/angular';
import { AppComponent } from './app.component';

const meta: Meta<AppComponent> = {
  title: 'app/Root',
  component: AppComponent,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<AppComponent>;
export const Primary: Story = { args: {} };

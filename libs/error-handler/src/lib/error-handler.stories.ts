import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerModule } from '@ngx-stoui/error-handler';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { WrapperModule } from './wrapper';

const meta: Meta = {
  title: 'Error Handling/Error Handling',
  decorators: [
    moduleMetadata({
      imports: [ErrorHandlerModule, WrapperModule, BrowserAnimationsModule],
    }),
  ],
};
export default meta;

type StoryType = StoryObj;
export const NormalUse: StoryType = {
  render: (args) => ({
    props: args,
    template: `<sto-next-wrapper></sto-next-wrapper>`,
  }),
  args: {},
};

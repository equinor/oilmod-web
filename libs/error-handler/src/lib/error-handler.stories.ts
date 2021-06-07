import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NextWrapperComponent, WrapperModule } from './wrapper';
import { ErrorHandlerModule } from '@ngx-stoui/error-handler';

export default {
  title: 'Error Handling/Error Handling',
  decorators: [
    moduleMetadata({
      imports: [ ErrorHandlerModule, WrapperModule, BrowserAnimationsModule
      ],
    })
  ],
} as Meta;

const Template: Story<Record<string, unknown>> = (args: Record<string, unknown> ) => {
  return {
    props: args,
    template: `<next-wrapper></next-wrapper>`,
  };
};
console.log(NextWrapperComponent);

export const NormalUse = Template.bind({});
NormalUse.args = {};

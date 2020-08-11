import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerModule } from '../../projects/stoui-error-handler/src/public_api';
import { WrapperModule } from './wrapper';

export default {
  title: 'Error Handling/Error Handling',
  decorators: [
    moduleMetadata({
      imports: [ ErrorHandlerModule, WrapperModule, BrowserAnimationsModule
      ],
    })
  ],
} as Meta;

const Template: Story<any> = (args: any) => {
  return {
    props: args,
    template: `<next-wrapper></next-wrapper>`,
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {};

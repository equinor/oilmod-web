import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { PreferenceManagerComponent, PreferenceManagerModule, StoFilterPanelComponent } from '../../projects/stoui-common/src/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'common/Preference Manager',
  component: PreferenceManagerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PreferenceManagerModule,
        BrowserAnimationsModule,
      ],
    })
  ],
  argTypes: {
    filterList: { table: { disable: true } }
  },
  parameters: {},
} as Meta;

export const Usage: Story<StoFilterPanelComponent> = (args: StoFilterPanelComponent) => {
  return {
    props: args,
    component: PreferenceManagerComponent,
  };
};



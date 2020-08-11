import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { StoAppHeaderComponent, StoAppHeaderModule } from '../../projects/stoui-common/src/public_api';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'common/Application Header',
  component: StoAppHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoAppHeaderModule,
        RouterTestingModule, HttpClientModule, MatButtonModule, MatMenuModule, MatIconModule, BrowserAnimationsModule ],
    })
  ],
} as Meta;

const Template: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    component: StoAppHeaderComponent,
    props: args,
  };
};

export const AppHeader = Template.bind({});
AppHeader.args = {
  title: 'Usage',
  breadCrumbs: [ { label: 'Root' }, { label: 'SubModule' }, ],
};

export const AsTestEnvironment = Template.bind({});
AsTestEnvironment.args = {
  title: 'Usage',
  breadCrumbs: [ { label: 'Root' }, { label: 'SubModule' }, ],
  environmentName: 'Systemtest',
  testEnvironment: true
};

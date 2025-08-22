import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoBreadcrumbsComponent,
  StoBreadcrumbsModule,
} from '@ngx-stoui/common';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

export default {
  title: 'common/Breadcrumbs',
  component: StoBreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoBreadcrumbsModule,
        RouterTestingModule,
        HttpClientModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
  argTypes: {
    breadCrumbs: { table: { disable: true } },
    homeBreadCrumbConfig: { table: { disable: true } },
    userMenu: { table: { disable: true } },
  },
  parameters: {},
} as Meta;

const Template: Story<StoBreadcrumbsComponent & { title?: string }> = (
  args: StoBreadcrumbsComponent
) => {
  return {
    props: args,
    // template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>`
  };
};

export const Breadcrumbs = Template.bind({});
Breadcrumbs.args = {
  title: 'Usage',
  model: [
    { label: 'Ext Url', url: window.location.href },
    { label: 'RouterLink', segment: 'submodule/again' },
    { label: 'Neither' },
  ],
};

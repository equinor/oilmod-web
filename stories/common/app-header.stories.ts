import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { StoAppHeaderComponent, StoAppHeaderModule } from '../../projects/stoui-common/src/public_api';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from '../../projects/stoui-common/src/lib/sto-app-header/sto-app-header.component.md';

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
  argTypes: {
    breadCrumbs: { control: { disable: true } },
    homeBreadCrumbConfig: { control: { disable: true } },
    userMenu: { control: { disable: true } },
  },
  parameters: {
    notes: { markdown }
  },
} as Meta;

const Template: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    props: args,
    template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>`
  };
};

export const AppHeader = Template.bind({});
AppHeader.args = {
  title: 'Usage',
  breadCrumbs: [ { label: 'Root' }, { label: 'SubModule' }, ],
};
AppHeader.argTypes = {
  homeBreadCrumbConfig: { control: { disable: true } },
  userMenu: { control: { disable: true } },
  breadCrumbs: { control: { disable: false } },
};

export const AsTestEnvironment: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    props: {
      breadCrumbs: [ { label: 'Root' }, { label: 'SubModule' }, ],
      environmentName: 'Systemtest',
      testEnvironment: true,
      ...args
    },
    template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>`
  };
};


export const WithUserMenu: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    props: {
      breadCrumbs: [ { label: 'Root' }, { label: 'SubModule' }, ],
      environmentName: 'Systemtest',
      testEnvironment: true,
      ...args
    },
    template: `
<sto-app-header [userMenu]="menu" [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>
<mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>settings</mat-icon>User Name</button></mat-menu>
`
  };
};

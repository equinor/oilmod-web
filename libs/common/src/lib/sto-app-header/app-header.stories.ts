import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoAppHeaderComponent,
  StoAppHeaderModule,
  StoThemeModule,
} from '@ngx-stoui/common';
import { StoFormModule } from '@ngx-stoui/form';
import { action } from 'storybook/actions';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

export default {
  title: 'common/Application Header',
  component: StoAppHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoAppHeaderModule,
        CommonModule,
        RouterTestingModule,
        HttpClientModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        StoFormModule,
        StoThemeModule.forRoot(),
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

const Template: Story<StoAppHeaderComponent & { title?: string }> = (
  args: StoAppHeaderComponent
) => {
  return {
    props: args,
    template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>`,
  };
};

export const AppHeader = Template.bind({});
AppHeader.args = {
  title: 'Usage',
  breadCrumbs: [{ label: 'Root' }, { label: 'SubModule' }],
};
AppHeader.argTypes = {
  homeBreadCrumbConfig: { control: { disable: true } },
  userMenu: { control: { disable: true } },
  breadCrumbs: { control: { disable: false } },
};

export const AsTestEnvironment: Story<StoAppHeaderComponent> = (
  args: StoAppHeaderComponent
) => {
  return {
    props: {
      ...args,
      environmentName: 'Systemtest',
      testEnvironment: true,
    },
    template: `<sto-app-header [breadCrumbs]="[ { label: 'Root' }, { label: 'SubModule' } ]" [environmentName]="environmentName" [testEnvironment]="true"></sto-app-header>`,
  };
};
AsTestEnvironment.argTypes = {
  testEnvironment: { table: { disable: true } },
};

export const WithUserMenu: Story<StoAppHeaderComponent> = (
  args: StoAppHeaderComponent
) => {
  return {
    props: {
      ...args,
      breadCrumbs: [
        { label: 'Root', command: action('Root clicked'), segment: '' },
        {
          label: 'SubModule',
          command: action('SubModule clicked'),
          segment: 'submodule',
        },
        {
          label: 'Third level!',
          command: action('Third clicked'),
          segment: 'third',
        },
      ],
      environmentName: 'Systemtest',
      homeConfig: { command: action('Home clicked') },
      testEnvironment: true,
    },
    styles: ['::ng-deep body .sto-header { left: 0; width: 100% !important; }'],
    template: `
<sto-app-header [userMenu]="menu" [breadCrumbs]="breadCrumbs" [homeBreadCrumbConfig]="homeConfig">
<button mat-icon-button><mat-icon>home</mat-icon></button>
</sto-app-header>
<mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>settings</mat-icon>User Name</button></mat-menu>
`,
  };
};
WithUserMenu.argTypes = {
  testEnvironment: { table: { disable: true } },
  environmentName: { table: { disable: true } },
};

export const withForm: Story<StoAppHeaderComponent> = (
  args: StoAppHeaderComponent
) => {
  return {
    props: {
      ...args,
      breadCrumbs: [
        { label: 'Root', command: action('Root clicked'), segment: '' },
        {
          label: 'SubModule',
          command: action('SubModule clicked'),
          segment: 'submodule',
        },
        {
          label: 'Third level!',
          command: action('Third clicked'),
          segment: 'third',
        },
      ],
      environmentName: 'Systemtest',
      homeConfig: { command: action('Home clicked') },
      testEnvironment: true,
    },
    styles: ['::ng-deep body .sto-header { left: 0; width: 100% !important; }'],
    template: `
<sto-app-header [userMenu]="menu" [breadCrumbs]="breadCrumbs" [homeBreadCrumbConfig]="homeConfig">
  <div class="sto-header__form">
    <mat-form-field stoFormField floatLabel="never" style="width: 600px">
      <mat-icon matPrefix>search</mat-icon>
      <mat-label>Search</mat-label>
      <input matInput>
    </mat-form-field>
  </div>
</sto-app-header>
<mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>settings</mat-icon>User Name</button></mat-menu>
`,
  };
};
withForm.argTypes = {
  testEnvironment: { table: { disable: true } },
};

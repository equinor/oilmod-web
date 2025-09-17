import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoAppHeaderComponent,
  StoAppHeaderModule,
  StoThemeModule,
} from '@ngx-stoui/common';
import { StoFormModule } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<StoAppHeaderComponent & { title?: string }> = {
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
        MatFormFieldModule,
        MatInputModule,
        StoFormModule,
        StoThemeModule.forRoot(),
      ],
    }),
  ],
  argTypes: {},
  parameters: {},
};
export default meta;

type StoryType = StoryObj<StoAppHeaderComponent & { title?: string }>;

export const AppHeader: StoryType = {
  args: {
    title: 'Usage',
    breadCrumbs: [{ label: 'Root' }, { label: 'SubModule' }],
  },
  render: (args) => ({
    props: args,
    template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="testEnvironment"></sto-app-header>`,
  }),
};

export const AsTestEnvironment: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      environmentName: 'Systemtest',
      testEnvironment: true,
      breadCrumbs: [{ label: 'Root' }, { label: 'SubModule' }],
    },
    template: `<sto-app-header [breadCrumbs]="breadCrumbs" [environmentName]="environmentName" [testEnvironment]="true"></sto-app-header>`,
  }),
};

export const WithUserMenu: StoryType = {
  render: (args) => ({
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
  }),
};

export const WithForm: StoryType = {
  render: (args) => ({
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
  }),
};

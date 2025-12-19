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
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  render: (args) => ({
    props: args,
    styles: ['::ng-deep body .sto-header { left: 0; width: 100% !important; }'],
  }),
};
export default meta;

type StoryType = StoryObj<StoAppHeaderComponent & { title?: string }>;

export const Default: StoryType = {
  args: {
    breadCrumbs: [{ label: 'Home' }, { label: 'Dashboard' }],
  },
  render: (args) => ({
    props: args,
    template: `<sto-app-header [breadCrumbs]="breadCrumbs"></sto-app-header>`,
  }),
};

export const WithAllFeatures: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      breadCrumbs: [
        { label: 'Home', command: action('Home clicked'), segment: '' },
        {
          label: 'Workspace',
          command: action('Workspace clicked'),
          segment: 'workspace',
        },
        { label: 'Settings', segment: 'settings' },
      ],
      homeConfig: { command: action('Home icon clicked') },
      environmentName: 'Development',
      testEnvironment: true,
    },
    template: `
<sto-app-header
  [breadCrumbs]="breadCrumbs"
  [homeBreadCrumbConfig]="homeConfig"
  [userMenu]="userMenu"
  [environmentName]="environmentName"
  [testEnvironment]="testEnvironment">
  <div class="sto-header__form">
    <mat-form-field stoFormField floatLabel="never" style="width: 400px">
      <mat-icon matPrefix>search</mat-icon>
      <mat-label>Search</mat-label>
      <input matInput>
    </mat-form-field>
  </div>
  <button matIconButton title="Notifications"><mat-icon>notifications</mat-icon></button>
  <button matIconButton title="Help"><mat-icon>help_outline</mat-icon></button>
</sto-app-header>
<mat-menu #userMenu="matMenu">
  <button mat-menu-item><mat-icon>person</mat-icon>John Doe</button>
  <button mat-menu-item><mat-icon>settings</mat-icon>Settings</button>
  <button mat-menu-item><mat-icon>logout</mat-icon>Sign Out</button>
</mat-menu>
`,
  }),
};

export const Accessibility: StoryType = {
  args: {
    breadCrumbs: [{ label: 'Accessibility Demo' }],
  },
  render: (args) => ({
    props: args,
    template: `
<div style="padding: 20px; margin-top: 80px;">
  <h2>Built-in Accessibility Features</h2>
  <p>Click the accessibility icon (♿) to toggle dark mode and adjust font size.</p>
  <p>These features are automatically included in every app header instance.</p>
</div>
<sto-app-header [breadCrumbs]="breadCrumbs"></sto-app-header>
`,
  }),
};

export const Responsive: StoryType = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => ({
    props: {
      ...args,
      breadCrumbs: [{ label: 'Home' }, { label: 'Products' }],
      environmentName: 'Mobile',
      testEnvironment: true,
    },
    template: `
<div style="padding: 20px; margin-top: 80px;">
  <h3>Responsive Behavior</h3>
  <p>On screens &lt; 500px wide, actions collapse into a menu (⋮)</p>
</div>
<sto-app-header
  [userMenu]="menu"
  [breadCrumbs]="breadCrumbs"
  [testEnvironment]="testEnvironment"
  [environmentName]="environmentName">
  <button matIconButton title="Notifications"><mat-icon>notifications</mat-icon></button>
  <button matIconButton title="Help"><mat-icon>help</mat-icon></button>
</sto-app-header>
<mat-menu #menu="matMenu">
  <button mat-menu-item><mat-icon>account_circle</mat-icon>User</button>
</mat-menu>
`,
  }),
};

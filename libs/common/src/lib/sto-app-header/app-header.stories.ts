import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { StoAppHeaderComponent, StoAppHeaderModule, StoThemeModule } from '@ngx-stoui/common';
import { CommonModule } from '@angular/common';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { StoFormModule } from '@ngx-stoui/form';

export default {
  title: 'common/Application Header',
  component: StoAppHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoAppHeaderModule, CommonModule,
        RouterTestingModule,
        HttpClientModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        StoFormModule,
        StoThemeModule.forRoot() ],
    })
  ],
  argTypes: {
    breadCrumbs: { table: { disable: true } },
    homeBreadCrumbConfig: { table: { disable: true } },
    userMenu: { table: { disable: true } },
  },
  parameters: {},
} as Meta;

const Template: Story<StoAppHeaderComponent & { title?: string }> = (args: StoAppHeaderComponent) => {
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
      ...args,
      environmentName: 'Systemtest',
      testEnvironment: true,
    },
    template: `<sto-app-header [breadCrumbs]="[ { label: 'Root' }, { label: 'SubModule' } ]" [environmentName]="environmentName" [testEnvironment]="true"></sto-app-header>`
  };
};
AsTestEnvironment.argTypes = {
  testEnvironment: { table: { disable: true } }
};


export const WithUserMenu: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    props: {
      ...args,
      breadCrumbs: [
        { label: 'Root', command: action('Root clicked'), segment: '' },
        { label: 'SubModule', command: action('SubModule clicked'), segment: 'submodule' },
        { label: 'Third level!', command: action('Third clicked'), segment: 'third' }
      ],
      environmentName: 'Systemtest',
      homeConfig: { command: action('Home clicked') },
      testEnvironment: true,
    },
    styles: [
      '::ng-deep body .sto-header { left: 0; width: 100% !important; }'
    ],
    template: `
<sto-app-header [userMenu]="menu" [breadCrumbs]="breadCrumbs" [homeBreadCrumbConfig]="homeConfig">
<button mat-icon-button><mat-icon>home</mat-icon></button>
</sto-app-header>
<mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>settings</mat-icon>User Name</button></mat-menu>
`
  };
};
WithUserMenu.argTypes = {
  testEnvironment: { table: { disable: true } },
  environmentName: { table: { disable: true } }
};

export const withForm: Story<StoAppHeaderComponent> = (args: StoAppHeaderComponent) => {
  return {
    props: {
      ...args,
      breadCrumbs: [
        { label: 'Root', command: action('Root clicked'), segment: '' },
        { label: 'SubModule', command: action('SubModule clicked'), segment: 'submodule' },
        { label: 'Third level!', command: action('Third clicked'), segment: 'third' }
      ],
      environmentName: 'Systemtest',
      homeConfig: { command: action('Home clicked') },
      testEnvironment: true,
    },
    styles: [
      '::ng-deep body .sto-header { left: 0; width: 100% !important; }'
    ],
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
`
  };
};
withForm.argTypes = {
  testEnvironment: { table: { disable: true } }
};

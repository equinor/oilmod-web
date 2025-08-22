import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoAppHeaderModule } from '@ngx-stoui/common';
import {
  NavDrawerComponent,
  NavDrawerModule,
  Navigation,
} from '@ngx-stoui/drawer';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

@Component({
  selector: 'wrapper',
  template: 'Hi',
})
class WrapperComponent {}

@Injectable({ providedIn: 'root' })
class IconService {
  constructor(private iconReg: MatIconRegistry) {
    this.iconReg.setDefaultFontSetClass('material-icons-outline');
  }
}

export default {
  title: 'Navigation/Drawer',
  component: NavDrawerComponent,
  parameters: {},
  decorators: [
    moduleMetadata({
      declarations: [WrapperComponent],
      providers: [IconService],
      imports: [
        NavDrawerModule,
        StoAppHeaderModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: '**', component: WrapperComponent },
        ]),
        BrowserModule,
        CommonModule,
      ],
    }),
  ],
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
  },
} as Meta;

const Template: Story<NavDrawerComponent> = (args: NavDrawerComponent) => {
  return {
    component: NavDrawerComponent,
    props: {
      ...args,
      activate: action('Activate route'),
    },
  };
};

const navigationItems = [
  {
    label: 'Direct route',
    route: ['/', 'home'],
    icon: 'home',
  },
  {
    label: 'Disabled',
    route: ['/', 'home'],
    icon: 'do_disturb',
    disabled: true,
  },
  {
    label: 'Internal route title',
    children: [
      {
        route: ['/', 'disabled', 'route1'],
        disabled: true,
        label: 'Disabled child route',
      },
      {
        route: ['/', 'route1'],
        label: 'Internal child route',
      },
      {
        route: ['/', 'route2'],
        label: 'Internal child route 2',
      },
      {
        route: ['/', 'route3'],
        label: 'Internal child route 3',
      },
      {
        route: ['/', 'route4'],
        label: 'Internal child route 4',
      },
      {
        route: ['/', 'route5'],
        label: 'Internal child route 5',
      },
      {
        route: ['/', 'route6'],
        label: 'Internal child route 6',
      },
    ],
    icon: 'dashboard',
    title: 'Dashboard',
  },
  {
    label: 'External',
    divider: 'above',
    children: [
      {
        link: 'https://example.com',
        target: '_blank',
        label: 'Example.com',
      },
    ],
    icon: 'open_in_new',
  },
  {
    link: '#',
    label: 'Disabled Route',
    children: [],
    icon: 'do_disturb',
    disabled: true,
  },
] as Array<Navigation>;

export const NormalUse = Template.bind({});
NormalUse.args = {
  navigationItems,
  collapsed: false,
};

export const WithAppHeader = (args: NavDrawerComponent) => {
  return {
    component: NavDrawerComponent,
    props: { ...args, activate: action('Activate route') },
    template: `
    <sto-app-header></sto-app-header>
    <sto-nav-drawer (activate)="collapsed = true; activate($event)" [withAppHeader]="true" [navigationItems]="navigationItems" [collapsed]="collapsed"></sto-nav-drawer>
    `,
  };
};
WithAppHeader.args = {
  navigationItems,
  collapsed: true,
};

import { CommonModule } from '@angular/common';
import { Component, Injectable, inject } from '@angular/core';
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
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

@Component({
  selector: 'wrapper',
  template: 'Hi',
  standalone: false,
})
class WrapperComponent {}

@Injectable({ providedIn: 'root' })
class IconService {
  private iconReg = inject(MatIconRegistry);

  constructor() {
    this.iconReg.setDefaultFontSetClass('material-icons-outline');
  }
}

const meta: Meta<any> = {
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
  argTypes: {},
};
export default meta;

type StoryType = StoryObj<
  NavDrawerComponent & { navigationItems: any[]; collapsed?: boolean }
>;
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

export const NormalUse: StoryType = {
  args: { navigationItems, collapsed: false },
  render: (args) => ({
    component: NavDrawerComponent,
    props: { ...args, activate: action('Activate route') },
  }),
};

export const WithAppHeader: StoryType = {
  args: { navigationItems, collapsed: true },
  render: (args) => ({
    component: NavDrawerComponent,
    props: { ...args, activate: action('Activate route') },
    template: `
    <sto-app-header></sto-app-header>
    <sto-nav-drawer (activate)="collapsed = true; activate($event)" [withAppHeader]="true" [navigationItems]="navigationItems" [collapsed]="collapsed"></sto-nav-drawer>
    `,
  }),
};

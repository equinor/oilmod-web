import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NavDrawerComponent, NavDrawerModule } from '@ngx-stoui/drawer';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { StoAppHeaderModule } from '@ngx-stoui/common';

@Component({
  selector: 'wrapper',
  template: 'Hi'
})
class WrapperComponent {
}

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
      declarations: [ WrapperComponent ],
      providers: [ IconService ],
      imports: [
        NavDrawerModule,
        StoAppHeaderModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: '**', component: WrapperComponent }
        ]),
        BrowserModule,
        CommonModule
      ]
    })
  ],
  argTypes: {
    open: {
      control: {type: 'boolean'}
    }
  }
} as Meta;

const Template: Story<NavDrawerComponent> = (args: NavDrawerComponent) => {
  return {
    component: NavDrawerComponent,
    props: args,
  };
};

const navigationItems = [
  {
    label: 'Direct route',
    route: [ '/', 'home' ],
    icon: 'home'
  },
  {
    label: 'Internal route title',
    children: [
      {
        route: [ '/', 'route1' ],
        label: 'Internal child route',
      },
      {
        route: [ '/', 'route2' ],
        label: 'Internal child route 2',
      },
      {
        route: [ '/', 'route3' ],
        label: 'Internal child route 3',
      },
      {
        route: [ '/', 'route4' ],
        label: 'Internal child route 4',
      },
      {
        route: [ '/', 'route5' ],
        label: 'Internal child route 5',
      },
      {
        route: [ '/', 'route6' ],
        label: 'Internal child route 6',
      },
    ],
    icon: 'dashboard',
    title: 'Dashboard'
  },
  {
    label: 'External',
    children: [
      {
        link: 'https://example.com',
        target: '_blank',
        label: 'Example.com'
      }
    ],
    icon: 'open_in_new',
  },
  {
    link: '#',
    label: 'Disabled Route',
    children: [],
    icon: 'do_disturb',
    disabled: true
  },
];

export const NormalUse = (args: NavDrawerComponent) => {
  return {
    component: NavDrawerComponent,
    props: args,
  };
};
NormalUse.args = {
  height: '100vh',
  navigationItems,
  collapsed: false
};


export const WithAppHeader = (args: NavDrawerComponent) => {
  return {
    component: NavDrawerComponent,
    props: args,
    template: `
    <sto-app-header></sto-app-header>
    <sto-nav-drawer [withAppHeader]="true" [navigationItems]="navigationItems" [collapsed]="collapsed"></sto-nav-drawer>
    `
  };
};
WithAppHeader.args = {
  navigationItems,
  collapsed: true,
};



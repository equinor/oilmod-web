import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoBreadcrumbsComponent,
  StoBreadcrumbsModule,
  NAVIGATION_HOME_ICON,
} from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<StoBreadcrumbsComponent> = {
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
      ],
    }),
  ],
  argTypes: {},
  parameters: {},
};
export default meta;

type StoryType = StoryObj<StoBreadcrumbsComponent>;

/**
 * Default breadcrumbs showcasing all navigation types and states:
 * - External URL navigation
 * - Router segment navigation
 * - Custom command handlers
 * - Disabled state
 * - Plain text (no action)
 * - Custom home breadcrumb
 */
export const Default: StoryType = {
  args: {
    home: { label: 'Home', segment: '/' },
    model: [
      { label: 'External Link', url: 'https://www.equinor.com' },
      { label: 'Router Link', segment: 'submodule/again' },
      {
        label: 'Custom Command',
        command: (event) => {
          console.log('Custom command clicked:', event);
          alert('Custom command executed!');
        },
      },
      { label: 'Disabled Item', segment: 'disabled-path', disabled: true },
      { label: 'Current Page' },
    ],
  },
};

/**
 * Breadcrumbs with custom home icon configuration via DI token.
 * Shows how to customize the home icon using NAVIGATION_HOME_ICON provider.
 */
export const CustomHomeIcon: StoryType = {
  decorators: [
    moduleMetadata({
      imports: [
        StoBreadcrumbsModule,
        RouterTestingModule,
        HttpClientModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: NAVIGATION_HOME_ICON,
          useValue: { icon: 'home', text: 'Dashboard' },
        },
      ],
    }),
  ],
  args: {
    home: { label: 'Dashboard', segment: '/' },
    model: [{ label: 'Settings', segment: 'settings' }, { label: 'Profile' }],
  },
};

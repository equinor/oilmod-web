import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoBreadcrumbsComponent,
  StoBreadcrumbsModule,
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
  // Hide complex inputs from controls if necessary via parameters instead of invalid argTypes keys
  argTypes: {},
  parameters: {},
};
export default meta;

type StoryType = StoryObj<StoBreadcrumbsComponent & { title?: string }>;
export const Breadcrumbs: StoryType = {
  args: {
    title: 'Usage',
    model: [
      { label: 'Ext Url', url: window.location.href },
      { label: 'RouterLink', segment: 'submodule/again' },
      { label: 'Neither' },
    ],
  },
};

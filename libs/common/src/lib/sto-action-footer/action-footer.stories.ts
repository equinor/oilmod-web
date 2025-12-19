import { MatButtonModule } from '@angular/material/button';
import { StoActionFooterComponent } from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

const meta: Meta<StoActionFooterComponent> = {
  title: 'common/Action footer',
  component: StoActionFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [StoActionFooterComponent, MatButtonModule],
    }),
  ],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Shows/hides the loading progress bar',
    },
    position: {
      control: 'select',
      options: ['fixed', 'absolute'],
      description: 'CSS position of the footer',
    },
    shouldAddClass: {
      control: 'boolean',
      description: 'Adds "sto-has-action-footer" class to body for padding',
    },
  },
  args: {
    isLoading: false,
    position: 'fixed',
    shouldAddClass: true,
  },
};
export default meta;

type StoryType = StoryObj<StoActionFooterComponent>;

export const Default: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel'),
    },
    template: `
      <sto-action-footer ${argsToTemplate(args)}>
        <button matButton (click)="save()" color="primary">Save</button>
        <button (click)="cancel()" matButton="filled">Cancel</button>
      </sto-action-footer>
    `,
  }),
};

export const Loading: StoryType = {
  args: {
    isLoading: true,
  },
  render: (args) => ({
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel'),
    },
    template: `
      <sto-action-footer ${argsToTemplate(args)}>
        <button matButton (click)="save()" color="primary" [disabled]="true">Save</button>
        <button (click)="cancel()" matButton="filled">Cancel</button>
      </sto-action-footer>
    `,
  }),
};

export const AbsolutePosition: StoryType = {
  args: {
    position: 'absolute',
    shouldAddClass: false,
  },
  render: (args) => ({
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel'),
    },
    template: `
      <div style="position: relative; height: 400px; border: 2px dashed #ccc; padding: 16px;">
        <p>Container with relative positioning</p>
        <sto-action-footer ${argsToTemplate(args)}>
          <button matButton (click)="save()" color="primary">Save</button>
          <button (click)="cancel()" matButton="filled">Cancel</button>
        </sto-action-footer>
      </div>
    `,
  }),
};

export const MultipleButtons: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      save: action('Save'),
      cancel: action('Cancel'),
      delete: action('Delete'),
      reset: action('Reset'),
    },
    template: `
      <sto-action-footer ${argsToTemplate(args)}>
        <button matButton (click)="save()" color="primary">Save</button>
        <button matButton (click)="reset()" color="accent">Reset</button>
        <button matButton="filled" (click)="cancel()">Cancel</button>
        <button matButton="filled" (click)="delete()" color="warn">Delete</button>
      </sto-action-footer>
    `,
  }),
};

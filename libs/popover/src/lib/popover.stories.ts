import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { PopoverFooterComponent } from './popover-footer.component';
import { PopoverTitleComponent } from './popover-title.component';
import { PopoverComponent } from './popover.component';
import { PopoverDirective } from './popover.directive';

const meta: Meta<PopoverComponent & Record<string, unknown>> = {
  component: PopoverComponent,
  title: 'overlay/Popover',
  args: {
    width: undefined,
    height: undefined,
    minWidth: 200,
    minHeight: undefined,
    backdropClass: undefined,
    panelClass: undefined,
    disableClose: undefined,
    hasBackdrop: true,
  },
  argTypes: {
    width: { type: 'number' },
    height: { type: 'number' },
    minWidth: { type: 'number' },
    minHeight: { type: 'number' },
    backdropClass: { type: 'string' },
    panelClass: { type: 'string' },
    disableClose: { type: 'boolean' },
    hasBackdrop: { type: 'boolean' },
  },
  parameters: { docs: { iframeHeight: 300 } },
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        PopoverDirective,
        PopoverComponent,
        PopoverTitleComponent,
        PopoverFooterComponent,
        MatButtonModule,
      ],
    }),
  ],
};
export default meta;

type StoryType = StoryObj<PopoverComponent & Record<string, unknown>>;

export const Usage: StoryType = {
  render: (args) => ({
    props: {
      ...args,
      open: false,
      onToggle: action('Toggled'),
      onSave: action('Save'),
      onClose: action('Close'),
    },
    template: `
<div style="margin-left: 300px; height: 500px;">
  <button (openStream)="onToggle($event)" (click)="open = !open" stoPopoverTrigger #trigger="stoPopoverTrigger">Toggle</button>
</div>
<sto-popover
  [width]="width"
  [height]="height"
  [minWidth]="minWidth"
  [minHeight]="minHeight"
  [backdropClass]="backdropClass"
  [panelClass]="panelClass"
  [viewportMargin]="viewportMargin"
  [scrollStrategy]="scrollStrategy"
  [disableClose]="disableClose"
  [hasBackdrop]="hasBackdrop"
  [trigger]="trigger">

  <sto-popover-title>This is title</sto-popover-title>
  <div>This is content</div>
  <div>This is also content</div>
  <sto-popover-footer>
    <button mat-flat-button color="primary" (click)="trigger.close(); onSave()">Save</button>
    <button mat-button (click)="trigger.close(); onClose()">Close</button>
  </sto-popover-footer>
</sto-popover>
`,
  }),
};

export const WithoutTitle: StoryType = {
  render: (args) => ({
    props: args,
    template: `
<div style="margin-left: 300px; height: 500px;">
  <button (click)="open = !open" stoPopoverTrigger #trigger="stoPopoverTrigger">Toggle</button>
</div>
<sto-popover [trigger]="trigger">
  <div>This is content</div>
  <div>This is also content</div>
  <sto-popover-footer>
    <button mat-flat-button color="primary" (click)="trigger.close()">Save</button>
    <button mat-button (click)="trigger.close()">Close</button>
  </sto-popover-footer>
</sto-popover>
`,
  }),
};

export const WithoutFooter: StoryType = {
  render: (args) => ({
    props: args,
    template: `
<div style="margin-left: 300px; height: 500px;">
  <button (click)="open = !open" stoPopoverTrigger #trigger="stoPopoverTrigger">Toggle</button>
</div>
<sto-popover [trigger]="trigger">
  <sto-popover-title>This is title</sto-popover-title>
  <div>This is content</div>
  <div>This is also content</div>
</sto-popover>
`,
  }),
};

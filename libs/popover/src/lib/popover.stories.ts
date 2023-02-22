import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopoverComponent } from './popover.component';
import { PopoverDirective } from './popover.directive';
import { PopoverTitleComponent } from './popover-title.component';
import { PopoverFooterComponent } from './popover-footer.component';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { action } from '@storybook/addon-actions';

export default {
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
    width: {
      type: 'number'
    },
    height: {
      type: 'number'
    },
    minWidth: {
      type: 'number'
    },
    minHeight: {
      type: 'number'
    },
    backdropClass: {
      type: 'string'
    },
    panelClass: {
      type: 'string'
    },
    disableClose: {
      type: 'boolean'
    },
    hasBackdrop: {
      type: 'boolean'
    },
  },
  parameters: {
    docs: { iframeHeight: 300 }
  },
  decorators: [
    moduleMetadata({
      imports: [ BrowserAnimationsModule, PopoverDirective, PopoverComponent, PopoverTitleComponent, PopoverFooterComponent, MatLegacyButtonModule ],
    }),
  ],
} as Meta;

export const Usage: Story<PopoverComponent & Record<string, unknown>> = (args) => ( {
  props: {
    ...args,
    open: false,
    onToggle: action('Toggled'),
    onSave: action('Save'),
    onClose: action('Close')
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
} );

export const WithoutTitle: Story = (args) => ( {
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
} );

export const WithoutFooter: Story = (args) => ( {
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
} );

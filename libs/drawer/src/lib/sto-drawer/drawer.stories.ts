import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  StoDrawerComponent,
  StoDrawerFooterComponent,
  StoDrawerHeaderComponent,
} from '@ngx-stoui/drawer';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

export default {
  title: 'Sidesheet/Presentation',
  component: StoDrawerComponent,
  parameters: {},
  decorators: [
    moduleMetadata({
      imports: [
        StoDrawerComponent,
        StoDrawerFooterComponent,
        StoDrawerHeaderComponent,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatCardModule,
      ],
    }),
  ],
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
  },
} as Meta;

const Template: Story<StoDrawerComponent> = (args: StoDrawerComponent) => {
  return {
    component: StoDrawerComponent,
    props: args,
    template: `
  <div>
  <sto-drawer [position]="'right'" [open]="true" [animation]="animation" [backdrop]="backdrop">
<sto-drawer-header>
<div class="sto-drawer__header__title">
<h2>Title</h2>
      </div>
</sto-drawer-header>

<mat-card class="sto-card"><p>Content in drawer</p></mat-card>

<sto-drawer-footer>
<button mat-button color="primary">Save</button>
</sto-drawer-footer>
</sto-drawer>


<mat-card class="sto-card sto-form">
<button mat-raised-button>Open</button>
</mat-card>
<mat-card class="sto-card sto-form">
<mat-card-title class="sto-card__title">Content title</mat-card-title>
</mat-card>
</div>
`,
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {
  position: 'right',
  open: true,
  width: '500px',
};

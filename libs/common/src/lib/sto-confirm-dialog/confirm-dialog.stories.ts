import { Component, NgModule, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // @ts-ignore
import { ConfirmModule, ConfirmService } from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
  selector: 'app-confirm-demo',
  template: ` <button (click)="show()" mat-button>Show confirm</button> `,
})
class ConfirmDemoComponent {
  private confirm = inject(ConfirmService);

  show() {
    this.confirm.confirm(
      'Confirmation message should be short',
      'Confirm delete',
      'Delete',
    );
  }
}

@NgModule({
  imports: [ConfirmDemoComponent],
  exports: [ConfirmDemoComponent],
})
class ConfirmerModule {}

const meta: Meta<ConfirmDemoComponent> = {
  title: 'common/Confirm Service',
  decorators: [
    moduleMetadata({
      imports: [
        ConfirmModule,
        ConfirmerModule,
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      declarations: [],
    }),
  ],
  parameters: {},
};
export default meta;

type StoryType = StoryObj<ConfirmDemoComponent>;
export const Usage: StoryType = {
  render: (args) => ({
    component: ConfirmDemoComponent,
    props: args,
    template: '<app-confirm-demo></app-confirm-demo>',
  }),
};

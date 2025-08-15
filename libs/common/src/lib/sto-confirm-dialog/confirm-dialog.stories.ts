import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // @ts-ignore
import { ConfirmModule, ConfirmService } from '@ngx-stoui/common';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';

@Component({
  selector: 'app-confirm-demo',
  template: ` <button (click)="show()" mat-button>Show confirm</button> `,
})
class ConfirmDemoComponent {
  constructor(private confirm: ConfirmService) {}

  show() {
    this.confirm.confirm(
      'Confirmation message should be short',
      'Confirm delete',
      'Delete'
    );
  }
}

@NgModule({
  declarations: [ConfirmDemoComponent],
  exports: [ConfirmDemoComponent],
})
class ConfirmerModule {}

export default {
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
} as Meta;

export const Usage: Story<ConfirmDemoComponent> = (
  args: ConfirmDemoComponent
) => {
  return {
    component: ConfirmDemoComponent,
    props: args,
    template: '<app-confirm-demo></app-confirm-demo>',
  };
};

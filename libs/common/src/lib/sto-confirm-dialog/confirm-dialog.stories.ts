import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// @ts-ignore
import { Component, NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModule, ConfirmService } from '@ngx-stoui/common';

const dialogConfig = new MatDialogConfig();
dialogConfig.width = '560px';
dialogConfig.panelClass = 'sto-dialog';

@Component({
  selector: 'app-confirm-demo',
  template: `
    <button (click)="show()"
            mat-button>Show confirm
    </button>
  `,

})
class ConfirmDemoComponent {
  show() {
    this.confirm.confirm('Confirmation message should be short', 'Confirm delete', 'Delete');
  }

  constructor(private confirm: ConfirmService) {
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
        ConfirmModule, ConfirmerModule, BrowserAnimationsModule, MatButtonModule ],
      declarations: [  ],
      providers: [ { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogConfig } ]
    })
  ],
  parameters: {
  },
} as Meta;


export const Usage: Story<ConfirmDemoComponent> = (args: ConfirmDemoComponent) => {
  return {
    component: ConfirmDemoComponent,
    props: args,
    template: '<app-confirm-demo></app-confirm-demo>'
  };
};

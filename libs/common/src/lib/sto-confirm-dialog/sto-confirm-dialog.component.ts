import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

type Data = {
  title: string;
  message: string;
  showCancel?: boolean;
  confirmText: string;
}

/**
 * A confirm dialog that emits an observable.
 */
@Component({
    selector: 'sto-confirm',
    template: `
    @if (data.title) {
      <h3
      mat-dialog-title>{{ data.title }}</h3>
    }
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button #ok
        color="primary"
        mat-flat-button
      [mat-dialog-close]="true">{{ data.confirmText }}</button>
      @if (data.showCancel) {
        <button #cancel
          title="Cancel (esc)"
          mat-button
          [mat-dialog-close]="false">Cancel
        </button>
      }
    </div>
    `,
    styleUrls: ['sto-confirm-dialog.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmComponent {
  data = inject<Data>(MAT_DIALOG_DATA);
  dialogRef = inject<MatDialogRef<ConfirmComponent>>(MatDialogRef);

  @ViewChild('ok')
  ok: ElementRef<HTMLButtonElement>;

}

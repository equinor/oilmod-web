import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    <h3 *ngIf="data.title"
        mat-dialog-title>{{ data.title }}</h3>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button #ok
              color="primary"
              mat-flat-button
              [mat-dialog-close]="true">{{ data.confirmText }}</button>
      <button #cancel
              *ngIf="data.showCancel"
              title="Cancel (esc)"
              mat-button
              [mat-dialog-close]="false">Cancel
      </button>
    </div>
  `,
  styleUrls: ['sto-confirm-dialog.component.scss']
})
export class ConfirmComponent {
  @ViewChild('ok')
  ok: ElementRef<HTMLButtonElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data, public dialogRef: MatDialogRef<ConfirmComponent>) {
  }

}

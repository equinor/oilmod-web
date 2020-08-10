import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * A confirm dialog that emits an observable.
 */
@Component({
  selector: 'sto-confirm',
  template: `
    <h1 *ngIf="data.title" mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
		    <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button #cancel color="primary" title="Cancel (esc)" mat-button [mat-dialog-close]="false">Cancel</button>
      <button #ok color="primary" mat-button [mat-dialog-close]="true">{{ data.confirmText }}</button>
     </div>
  `,
  styleUrls: ['sto-confirm-dialog.component.scss']
})
export class ConfirmComponent {
  @ViewChild('ok')
  ok: ElementRef<HTMLButtonElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmComponent>) {
  }

}

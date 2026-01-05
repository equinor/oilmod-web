import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

interface ConfirmDialogData {
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
      <h3 mat-dialog-title>{{ data.title }}</h3>
    }
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button color="primary" matButton [mat-dialog-close]="true">
        {{ data.confirmText }}
      </button>
      @if (data.showCancel) {
        <button
          title="Cancel (esc)"
          matButton="filled"
          [mat-dialog-close]="false"
        >
          Cancel
        </button>
      }
    </div>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ConfirmComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmComponent>);
}

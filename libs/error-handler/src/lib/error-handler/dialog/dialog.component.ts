import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { HttpError } from '../http-error';

import { MatButton } from '@angular/material/button';

@Component({
  selector: 'sto-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: HttpError,
    private ref: MatDialogRef<DialogComponent>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEvent(action: ((...args: any[]) => unknown) | unknown | undefined) {
    if (typeof action === 'function') {
      try {
        action(this.data);
      } catch (ex) {
        console.warn('Failed to execute function.');
        console.warn(ex);
      }
    }
    this.ref.close(action || this.data);
  }
}

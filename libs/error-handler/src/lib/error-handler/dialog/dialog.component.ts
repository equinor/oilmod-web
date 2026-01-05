import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
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
  readonly data = inject<HttpError>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<DialogComponent>);

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

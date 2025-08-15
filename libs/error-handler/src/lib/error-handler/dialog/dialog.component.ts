import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpError } from '../http-error';

@Component({
  selector: 'sto-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HttpError,
    private ref: MatDialogRef<DialogComponent>
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

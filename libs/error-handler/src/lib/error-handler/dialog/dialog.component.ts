import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { HttpError } from '../http-error';
import { CdkScrollable } from '@angular/cdk/scrolling';

import { MatButton } from '@angular/material/button';

@Component({
    selector: 'sto-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class DialogComponent {
  data = inject<HttpError>(MAT_DIALOG_DATA);
  private ref = inject<MatDialogRef<DialogComponent>>(MatDialogRef);


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

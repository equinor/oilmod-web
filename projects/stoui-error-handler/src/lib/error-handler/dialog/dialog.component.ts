import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpError } from '../http-error';

@Component({
  selector: 'sto-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.scss' ]
})
export class DialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: HttpError, private ref: MatDialogRef<DialogComponent>) {
  }

  handleEvent(action: Function | Object) {
    if ( typeof action === 'function' ) {
      action(this.data);
    }
    this.ref.close(action || this.data);
  }
}

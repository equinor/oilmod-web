import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { HttpError } from './http-error';

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  private ref: MatDialogRef<DialogComponent>;

  constructor(private dialog: MatDialog) {}

  // Opens a dialog, and returns the reference with the close results.
  open(err: HttpError): MatDialogRef<DialogComponent, unknown> {
    if (this.ref) {
      this.ref.close(null);
    }
    this.ref = this.dialog.open(DialogComponent, {
      data: err,
      width: '560px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'sto-dialog',
    });
    return this.ref;
  }
}

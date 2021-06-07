import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpError } from './http-error';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private ref: MatDialogRef<DialogComponent>;

  constructor(private dialog: MatDialog) {
  }

  // Opens a dialog, and returns the reference with the close results.
  open(err: HttpError): MatDialogRef<DialogComponent, any> {
    if ( this.ref ) {
      this.ref.close(null);
    }
    this.ref = this.dialog.open(DialogComponent, {
      data: err,
      width: '560px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'sto-dialog'
    });
    return this.ref;
  }
}

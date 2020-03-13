import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpError } from './http-error';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(private dialog: MatDialog) {
  }

  open(err: HttpError): MatDialogRef<DialogComponent, any> {
    return this.dialog.open(DialogComponent, {
      data: err,
      width: '560px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'sto-dialog'
    });
  }
}

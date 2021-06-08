import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { ConfirmComponent } from './sto-confirm-dialog.component';


@Injectable()
export class ConfirmService {
  public ref: MatDialogRef<ConfirmComponent> | null;

  constructor(private dialog: MatDialog) {
  }

  confirm(message: string, title = 'Confirm', confirmText = 'OK', showCancel = true): Observable<boolean> {
    this.ref = this.dialog.open(ConfirmComponent, {
      data: { message, title, confirmText, showCancel }
    });

    const subject = new ReplaySubject<boolean>();

    this.ref.afterClosed()
      .subscribe(result => {
        this.ref = null;
        subject.next(result);
        subject.complete();
      });
    return subject;
  }

}

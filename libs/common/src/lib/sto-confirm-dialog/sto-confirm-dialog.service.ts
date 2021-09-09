import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { ConfirmComponent } from './sto-confirm-dialog.component';

const dialogConfig = new MatDialogConfig();
dialogConfig.width = '560px';
dialogConfig.panelClass = 'sto-dialog';

@Injectable()
export class ConfirmService {
  public ref: MatDialogRef<ConfirmComponent> | null;

  constructor(private dialog: MatDialog) {
  }

  confirm(message: string, title = 'Confirm', confirmText = 'OK', showCancel = true, options = dialogConfig): Observable<boolean> {
    this.ref = this.dialog.open(ConfirmComponent, {
      ...options,
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

import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from './sto-confirm-dialog.component';

const DEFAULT_DIALOG_CONFIG: MatDialogConfig = {
  width: '560px',
  panelClass: 'sto-dialog',
};

@Injectable()
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  confirm(
    message: string,
    title = 'Confirm',
    confirmText = 'OK',
    showCancel = true,
    options: MatDialogConfig = DEFAULT_DIALOG_CONFIG,
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      ...options,
      data: { message, title, confirmText, showCancel },
    });

    return dialogRef.afterClosed();
  }
}

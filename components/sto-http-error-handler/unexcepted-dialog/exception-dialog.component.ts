import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { take } from 'rxjs/operators';

/**
 * Used to present error messages to the end user if any action is required, or if the error is critical.
 * If the returned error was an offline-error, the dialog will automatically close when connectivity is restored.
 * On close, triggers the user requested action or returns the closeDialogData attribute on the error object
 */
@Component({
  selector: 'imo-exception-dialog',
  templateUrl: './exception-dialog.component.html',
  styles: [`.mat-dialog-actions{
      float: right;
  }`
  ]
})
export class ExceptionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ExceptionDialogComponent>) {
  }

  ngOnInit() {
    if (this.data.status === 0) {
      this.listenForOnlineChanges();
    }
  }

  private listenForOnlineChanges() {
    fromEvent(window, 'online')
      .pipe(
        take(1)
      )
      .subscribe(event => {
        this.dialogRef.close(null);
      });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { take } from 'rxjs/operators';

@Component({
  selector: 'imo-exception-dialog',
  templateUrl: './exception-dialog.component.html',
  styles: []
})
export class ExceptionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ExceptionDialogComponent>) {
  }

  ngOnInit() {
    if (this.data.status === 0) {
      fromEvent(window, 'online')
        .pipe(
          take(1)
        )
        .subscribe(event => {
          this.dialogRef.close(null);
        });
    }
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

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
      Observable.fromEvent(window, 'online')
        .subscribe(event => {
          this.dialogRef.close(null);
        });
    }
  }

}

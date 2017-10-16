import { Component, Inject, Injectable, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-confirm',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
        <p>{{data.message}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">{{data.confirmText}}</button>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
     </div>
  `
})
export class ConfirmComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ConfirmComponent>) {
  }

}


@Injectable()
export class ConfirmService {

  constructor(private dialog: MatDialog) {
  }

  confirm(message: string, title = 'Confirm', confirmText = 'OK'): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {message, title, confirmText}
    });

    return dialogRef.afterClosed();
  }

}


@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    ConfirmService
  ],
  entryComponents: [
    ConfirmComponent
  ]
})
export class ConfirmModule {
}

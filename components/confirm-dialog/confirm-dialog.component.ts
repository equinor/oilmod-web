import { Component, Inject, Injectable, NgModule } from '@angular/core';
import { MD_DIALOG_DATA, MdButtonModule, MdDialog, MdDialogModule, MdDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-confirm',
  template: `
    <h1 md-dialog-title>Confirm</h1>
    <div md-dialog-content>
        <p>{{data.message}}</p>
    </div>
    <div md-dialog-actions>
      <button md-button [md-dialog-close]="true">Ok</button>
      <button md-button [md-dialog-close]="false">Cancel</button>
     </div>
  `
})
export class ConfirmComponent {

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              private dialogRef: MdDialogRef<ConfirmComponent>) {
  }

}


@Injectable()
export class ConfirmService {

  constructor(private dialog: MdDialog) {
  }

  confirm(message: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {message}
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
    MdDialogModule,
    MdButtonModule
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

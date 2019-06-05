import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { ConfirmService } from './sto-confirm-dialog.service';
import { ConfirmComponent } from './sto-confirm-dialog.component';


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

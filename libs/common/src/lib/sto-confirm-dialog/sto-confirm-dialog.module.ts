import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
  ]
})
export class ConfirmModule {
}

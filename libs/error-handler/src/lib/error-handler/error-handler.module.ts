import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ErrorDialogService } from './error-dialog.service';
import { ErrorHandlerService } from './error-handler.service';
import { DialogComponent } from './dialog/dialog.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [ DialogComponent ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    ErrorHandlerService,
    ErrorDialogService
  ]
})
export class ErrorHandlerModule {
}

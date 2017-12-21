import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExceptionDialogComponent } from './unexcepted-dialog/exception-dialog.component';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [ExceptionDialogComponent],
  entryComponents: [ExceptionDialogComponent],
  providers: [HttpErrorHandlerService]
})
export class HttpErrorHandlerModule {
}

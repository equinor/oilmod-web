import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExceptionDialogComponent } from './unexcepted-dialog/exception-dialog.component';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorFormatter } from './error-formatter';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [ExceptionDialogComponent],
  entryComponents: [ExceptionDialogComponent],
})
/**
 * @deprecated
 * HttpErrorHandlerModule has been deprecated and will be removed at a later time. Migrate to {@link ErrorHandlerModule}
 */
export class HttpErrorHandlerModule {
  static forRoot(): ModuleWithProviders<HttpErrorHandlerModule> {
    return {
      ngModule: HttpErrorHandlerModule,
      providers: [ HttpErrorHandlerService, ErrorFormatter ]
    };
  }
}

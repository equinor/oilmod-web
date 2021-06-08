import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogService } from './error-dialog.service';
import { ErrorHandlerService } from './error-handler.service';
import { DialogComponent } from './dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  entryComponents: [ DialogComponent ],
})
export class ErrorHandlerModule {
}

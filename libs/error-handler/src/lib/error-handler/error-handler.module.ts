import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ErrorDialogService } from './error-dialog.service';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  providers: [ErrorHandlerService, ErrorDialogService],
})
export class ErrorHandlerModule {}

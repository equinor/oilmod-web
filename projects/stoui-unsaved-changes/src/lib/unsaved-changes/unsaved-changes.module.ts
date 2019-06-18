import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UnsavedChangesGuard } from './unsaved-changes.guard';

@NgModule({
  imports: [MatDialogModule, MatButtonModule],
  exports: [ConfirmDialogComponent],
  providers: [UnsavedChangesGuard],
  declarations: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class UnsavedChangesModule {
}

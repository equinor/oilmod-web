import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DocsService } from './docs.service';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule
  ],
  declarations: [DocsComponent],
  entryComponents: [DocsComponent],
  exports: [DocsComponent],
  providers: [DocsService]
})
export class DocsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WysiwygComponent } from './wysiwyg.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';

@NgModule({
  declarations: [ WysiwygComponent, WysiwygActionsComponent, WysiwygEditorComponent ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule
  ],
  exports: [ WysiwygComponent ]
})
export class StoWysiwygModule {
}

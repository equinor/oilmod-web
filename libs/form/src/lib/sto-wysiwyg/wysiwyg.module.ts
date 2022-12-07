import { WysiwygComponent } from './wysiwyg.component';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';

/**
 * @deprecated WysiwygComponent is standalone, import it directly.
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ WysiwygComponent, WysiwygActionsComponent, WysiwygEditorComponent ],
  exports: [ WysiwygComponent, WysiwygActionsComponent, WysiwygEditorComponent ]
})
export class StoWysiwygModule {
}

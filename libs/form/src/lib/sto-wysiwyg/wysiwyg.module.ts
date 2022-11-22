import { WysiwygComponent } from './wysiwyg.component';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';

/**
 * @deprecated WysiwygComponent is standalone, import it directly.
 */
export const StoWysiwygModule = [ WysiwygComponent, WysiwygActionsComponent, WysiwygEditorComponent ];

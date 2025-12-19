import { ContextMenuDirective } from './context-menu.directive';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';
import { MenuOverlayDirective } from './menu-overlay.directive';
import { QuickKeysDirective } from './quick-keys.directive';
import {
  StoGridColumnDirective,
  StoGridDirective,
  StoGridSpacerDirective,
} from './sto-grid.directive';
import { StoSelectTextOnFocusDirective } from './sto-select-text-on-focus.directive';

/**
 * Directives have been made standalone, import them directly:
 *     QuickKeysDirective
 *     DateFormFieldClickDirective
 *     StoSelectTextOnFocusDirective
 *     StoGridDirective
 *     StoGridColumnDirective
 *     StoGridSpacerDirective
 *     MenuOverlayDirective
 *     ContextMenuDirective
 *
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    QuickKeysDirective,
    DateFormFieldClickDirective,
    StoSelectTextOnFocusDirective,
    StoGridDirective,
    StoGridColumnDirective,
    StoGridSpacerDirective,
    MenuOverlayDirective,
    ContextMenuDirective,
  ],
  exports: [
    QuickKeysDirective,
    DateFormFieldClickDirective,
    StoSelectTextOnFocusDirective,
    StoGridDirective,
    StoGridColumnDirective,
    StoGridSpacerDirective,
    MenuOverlayDirective,
    ContextMenuDirective,
  ],
})
export class StoDirectivesModule {}

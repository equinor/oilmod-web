import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';
import { StoSelectTextOnFocusDirective } from './sto-select-text-on-focus.directive';
import { StoGridColumnDirective, StoGridDirective, StoGridSpacerDirective } from './sto-grid.directive';
import { LayoutModule } from '@angular/cdk/layout';
import { MenuOverlayDirective } from './menu-overlay.directive';
import { ContextMenuDirective } from './context-menu.directive';


@NgModule({
  imports: [ CommonModule, LayoutModule ],
  declarations: [
    QuickKeysDirective
    , DateFormFieldClickDirective
    , StoSelectTextOnFocusDirective
    , StoGridDirective
    , StoGridColumnDirective
    , StoGridSpacerDirective
    , MenuOverlayDirective
    , ContextMenuDirective
  ],
  exports: [
    QuickKeysDirective
    , DateFormFieldClickDirective
    , StoSelectTextOnFocusDirective
    , StoGridDirective
    , StoGridColumnDirective
    , StoGridSpacerDirective
    , MenuOverlayDirective
    , ContextMenuDirective
  ]
})
export class StoDirectivesModule {
}

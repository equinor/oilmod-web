import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';
import { StoIgnoreMenuBackdropDirective } from './sto-ignore-menu-backdrop.directive';
import { StoIgnoreContextmenuBackdropDirective } from './sto-ignore-contextmenu-backdrop.directive';
import { StoMenuFocusDirective } from './menu-focus.directive';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';
import { StoSelectTextOnFocusDirective } from './sto-select-text-on-focus.directive';
import { StoGridColumnDirective, StoGridDirective, StoGridSpacerDirective } from './sto-grid.directive';
import { LayoutModule } from '@angular/cdk/layout';


@NgModule({
  imports: [ CommonModule, LayoutModule ],
  declarations: [
    QuickKeysDirective
    , StoIgnoreMenuBackdropDirective
    , StoIgnoreContextmenuBackdropDirective
    , StoMenuFocusDirective
    , DateFormFieldClickDirective
    , StoSelectTextOnFocusDirective
    , StoGridDirective
    , StoGridColumnDirective
    , StoGridSpacerDirective
  ],
  exports: [
    QuickKeysDirective
    , StoIgnoreMenuBackdropDirective
    , StoIgnoreContextmenuBackdropDirective
    , StoMenuFocusDirective
    , DateFormFieldClickDirective
    , StoSelectTextOnFocusDirective
    , StoGridDirective
    , StoGridColumnDirective
    , StoGridSpacerDirective
  ]
})
export class StoDirectivesModule {
}

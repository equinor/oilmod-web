import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';
import { StoIgnoreMenuBackdropDirective } from './sto-ignore-menu-backdrop.directive';
import { StoIgnoreContextmenuBackdropDirective } from './sto-ignore-contextmenu-backdrop.directive';
import { StoMenuFocusDirective } from './menu-focus.directive';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';


@NgModule({
  imports: [CommonModule],
  declarations: [
     QuickKeysDirective
   , StoIgnoreMenuBackdropDirective
   , StoIgnoreContextmenuBackdropDirective
   , StoMenuFocusDirective
   , DateFormFieldClickDirective
  ],
  exports: [
    QuickKeysDirective
    , StoIgnoreMenuBackdropDirective
    , StoIgnoreContextmenuBackdropDirective
    , StoMenuFocusDirective
    , DateFormFieldClickDirective
  ]
})
export class StoDirectivesModule {}

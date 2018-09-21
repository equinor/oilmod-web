import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';
import { StoIgnoreMenuBackdropDirective } from './sto-ignore-menu-backdrop.directive';
import { StoIgnoreContextmenuBackdropDirective } from './sto-ignore-contextmenu-backdrop.directive';
import { StoMenuFocusDirective } from './menu-focus.directive';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';
import { StoSelectTextOnFocusDirective } from './sto-select-text-on-focus.directive';
import { StoUserPreferenceModule } from '../sto-user-preference/sto-user-preference.module';


@NgModule({
  imports: [CommonModule],
  declarations: [
     QuickKeysDirective
   , StoIgnoreMenuBackdropDirective
   , StoIgnoreContextmenuBackdropDirective
   , StoMenuFocusDirective
   , DateFormFieldClickDirective
   , StoSelectTextOnFocusDirective
   ,
  ],
  exports: [
    QuickKeysDirective
    , StoIgnoreMenuBackdropDirective
    , StoIgnoreContextmenuBackdropDirective
    , StoMenuFocusDirective
    , DateFormFieldClickDirective
    , StoSelectTextOnFocusDirective
  ]
})
export class StoDirectivesModule {}

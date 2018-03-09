import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';
import { StoIgnoreMenuBackdropDirective } from './sto-ignore-menu-backdrop.directive';
import { StoIgnoreContextmenuBackdropDirective } from './sto-ignore-contextmenu-backdrop.directive';


@NgModule({
  imports: [CommonModule],
  declarations: [
     QuickKeysDirective
   , StoIgnoreMenuBackdropDirective
   , StoIgnoreContextmenuBackdropDirective
  ],
  exports: [QuickKeysDirective, StoIgnoreMenuBackdropDirective, StoIgnoreContextmenuBackdropDirective]
})
export class StoDirectivesModule {}

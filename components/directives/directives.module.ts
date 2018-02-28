import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickKeysDirective } from './quick-keys.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [QuickKeysDirective],
  exports: [QuickKeysDirective]
})
export class StoDirectivesModule {}

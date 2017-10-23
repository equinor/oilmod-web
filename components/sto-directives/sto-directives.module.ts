import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModeDirective } from './edit-mode.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [EditModeDirective],
  exports: [EditModeDirective]
})
export class StoDirectivesModule {
}
import { SlideToggleComponent } from './slide-toggle.component';

/**
 * @deprecated SlideToggleComponent has been made standalone
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ SlideToggleComponent ],
  exports: [ SlideToggleComponent ]
})
export class SlideToggleModule {
}

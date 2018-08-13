import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { QuickViewComponent } from './quick-view.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [QuickViewComponent],
  exports: [QuickViewComponent, OverlayModule],
  entryComponents: [QuickViewComponent]
})
export class QuickViewModule {
}

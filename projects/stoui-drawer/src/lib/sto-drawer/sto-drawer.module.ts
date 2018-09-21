import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  StoDrawerComponent,
  StoDrawerFooterComponent,
  StoDrawerHeaderComponent,
  StoDrawerWrapperComponent
} from './sto-drawer.component';


@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent],
  declarations: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent]
})
export class StoDrawerModule {
}

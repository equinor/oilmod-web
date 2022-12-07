import { StoDrawerComponent } from './sto-drawer.component';
import { StoDrawerWrapperComponent } from './sto-drawer-wrapper.component';
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';
import { StoDrawerHeaderComponent } from './sto-drawer-header.component';

/**
 * @deprecated StoDrawer has been made standalone, import component(s) directly
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent ],
  exports: [ StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent ]
})
export class StoDrawerModule {
}

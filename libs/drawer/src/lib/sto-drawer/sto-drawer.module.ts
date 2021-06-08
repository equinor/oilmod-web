import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoDrawerComponent } from './sto-drawer.component';
import { StoDrawerWrapperComponent } from './sto-drawer-wrapper.component';
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';
import { StoDrawerHeaderComponent } from './sto-drawer-header.component';


@NgModule({
  imports: [ CommonModule, RouterModule ],
  exports: [ StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent ],
  declarations: [ StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent ]
})
export class StoDrawerModule {
}

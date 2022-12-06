import { StoAppHeaderComponent } from './sto-app-header.component';

/**
 * @deprecated StoAppHeaderComponent has been made standalone
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ StoAppHeaderComponent ],
  exports: [ StoAppHeaderComponent ]
})
export class StoAppHeaderModule {
}

import { NgModule } from '@angular/core';
import { StoSelectFilterComponent } from './sto-select-filter.component';

/**
 * @deprecated Use StoSelectFilterComponent directly instead.
 * This module is kept for backward compatibility only.
 */
@NgModule({
  imports: [StoSelectFilterComponent],
  exports: [StoSelectFilterComponent],
})
export class StoSelectFilterModule {}

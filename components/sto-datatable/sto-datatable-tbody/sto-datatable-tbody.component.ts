import { StoDatatableComponent } from '../sto-datatable.component';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import { Column } from '../../../vendor/primeface/components/common/shared';

@Component({
  selector: '[stoTableBody]',
  templateUrl: 'sto-datatable-tbody.component.html'
})
export class StoTableBody {

  constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt: StoDatatableComponent) {
  }

  @Input('stoTableBody') columns: Column[];

  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }
}

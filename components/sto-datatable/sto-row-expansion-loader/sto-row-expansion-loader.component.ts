import { RowExpansionLoader } from '../../../vendor/primeface/components/datatable/datatable';
import { Component, ViewContainerRef } from '@angular/core';
@Component({
  selector: 'sto-rowExpansionLoader',
  template: ``
})
export class StoRowExpansionLoader extends RowExpansionLoader {
  constructor(public viewContainer: ViewContainerRef) {
    super(viewContainer);
  }
}
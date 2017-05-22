import { StoDatatableComponent } from '../sto-datatable.component';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import { Column } from '../../../vendor/primeface/components/common/shared';

@Component({
  selector: '[stoColumnFooters]',
  templateUrl : 'sto-datatable-footer.component.html'
})
export class StoColumnFooters {

  @Input('stoColumnFooters') columns: Column[];

  constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt: StoDatatableComponent) {
  }

}
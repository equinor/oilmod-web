import { Component, forwardRef, Inject } from '@angular/core';
import { TreeTable, UITreeRow } from '../../../vendor/primeface/components/treetable/treetable';
import { StoTreeTableComponent } from '../sto-treetable.component';

@Component({
  selector: '[stoTreeRow]',
  templateUrl: 'sto-treetable-row.html'

})
export class StoUITreeRow extends UITreeRow {

  constructor(@Inject(forwardRef(() => StoTreeTableComponent)) public treeTable: StoTreeTableComponent) {
    super(<TreeTable> treeTable);
  }

}

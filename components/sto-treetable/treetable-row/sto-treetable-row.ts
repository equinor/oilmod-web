import { Component, forwardRef, Inject, Input } from '@angular/core';
import { TreeTable, UITreeRow } from '../../../vendor/primeface/components/treetable/treetable';
import { StoTreeTableComponent } from '../sto-treetable.component';

@Component({
  selector: '[stoTreeRow]',
  templateUrl: 'sto-treetable-row.html'

})
export class StoUITreeRow extends UITreeRow {

  @Input() canSelectChildren: boolean;

  onRowClick(event: MouseEvent) {
    if (!this.canSelectChildren && !this.parentNode) {
      this.treeTable.onRowClick(event, this.node);
    }
    else if (this.canSelectChildren) {
      this.treeTable.onRowClick(event, this.node);
    }
  }

  constructor(@Inject(forwardRef(() => StoTreeTableComponent)) public treeTable: StoTreeTableComponent) {
    super(<TreeTable> treeTable);
  }

}

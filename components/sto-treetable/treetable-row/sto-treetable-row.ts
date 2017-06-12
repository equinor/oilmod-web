import { Component, forwardRef, Inject, Input } from '@angular/core';
import { TreeTable, UITreeRow } from '../../../vendor/primeface/components/treetable/treetable';
import { StoTreeTableComponent } from '../sto-treetable.component';

@Component({
  selector: '[stoTreeRow]',
  templateUrl: 'sto-treetable-row.html'

})
export class StoUITreeRow extends UITreeRow {

  @Input() canSelectChildren: boolean;
  @Input() disableSelectKey: string;

  onRowClick(event: MouseEvent) {
    if (!this.canSelectChildren && !this.parentNode && !this.isSelectDisabled()) {
      this.treeTable.onRowClick(event, this.node);
    }
    else if (this.canSelectChildren && !this.isSelectDisabled()) {
      this.treeTable.onRowClick(event, this.node);
    }
  }

  public isSelectDisabled() {
    return this.node.data[this.disableSelectKey];
  }

  constructor(@Inject(forwardRef(() => StoTreeTableComponent)) public treeTable: StoTreeTableComponent) {
    super(<TreeTable> treeTable);
  }

}

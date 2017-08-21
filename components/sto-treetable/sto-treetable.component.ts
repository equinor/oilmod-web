import { Component, ContentChild, ContentChildren, Inject, forwardRef, Input, NgModule, QueryList, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoColumn, StoFooter, StoHeader, StoSharedModule } from '../sto-shared/sto-shared';
import { TreeTable, UITreeRow } from '../../vendor/primeface/components/treetable/treetable';

@Component({
  selector: 'sto-treeTable',
  styleUrls: ['sto-treetable.component.scss'],
  templateUrl: 'sto-treetable.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StoTreeTableComponent extends TreeTable {

  @Input() canSelectChildren = true;
  @Input() disableSelectKey: string;

  @ContentChild(StoHeader) header: StoHeader;
  @ContentChild(StoFooter) footer: StoFooter;
  @ContentChildren(StoColumn) columns: QueryList<StoColumn>;

}

@Component({
  selector: '[stoTreeRow]',
  templateUrl: 'treetable-row/sto-treetable-row.html'

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

@NgModule({
  imports: [CommonModule, StoSharedModule],
  exports: [StoSharedModule, StoTreeTableComponent, StoUITreeRow],
  declarations: [StoTreeTableComponent, StoUITreeRow]
})
export class StoTreeTableModule {
}

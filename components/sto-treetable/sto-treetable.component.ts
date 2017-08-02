import { Component, ContentChild, ContentChildren, Input, NgModule, QueryList, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoColumn, StoFooter, StoHeader, StoSharedModule } from '../sto-shared/sto-shared';
import { TreeTable } from '../../vendor/primeface/components/treetable/treetable';
import { StoUITreeRow } from './treetable-row/sto-treetable-row';

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

@NgModule({
  imports: [CommonModule, StoSharedModule],
  exports: [StoSharedModule, StoTreeTableComponent, StoUITreeRow],
  declarations: [StoTreeTableComponent, StoUITreeRow]
})
export class StoTreeTableModule {
}

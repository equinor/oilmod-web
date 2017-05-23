import {
    Component, ContentChild, EventEmitter, forwardRef, Inject, Input, NgModule, OnInit,
    Output, ContentChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoSharedModule, StoFooter, StoHeader, StoColumn } from '../sto-shared/sto-shared';
import { TreeTable, TreeTableModule } from '../../vendor/primeface/components/treetable/treetable';
import { SharedModule } from '../../vendor/primeface/components/common/shared';
import { TreeNode } from '../../vendor/primeface/components/common/api';
import { StoUITreeRow } from './treetable-row/sto-treetable-row';

@Component({
    selector: 'sto-treeTable',
    templateUrl : 'sto-treetable.component.html'
})
export class StoTreeTableComponent extends TreeTable {
    @ContentChild(StoHeader) header: StoHeader;

    @ContentChild(StoFooter) footer: StoFooter;

    @ContentChildren(StoColumn) columns: QueryList<StoColumn>;

}

@NgModule({
    imports: [CommonModule, StoSharedModule, SharedModule, TreeTableModule],
    exports: [StoSharedModule, SharedModule, StoTreeTableComponent, StoUITreeRow],
    declarations: [StoTreeTableComponent, StoUITreeRow]
})
export class StoTreeTableModule {
}
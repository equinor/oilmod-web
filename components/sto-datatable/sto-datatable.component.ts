import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  NgModule,
  QueryList,
  Renderer,
  ViewEncapsulation
} from '@angular/core';
import { DataTable, DataTableModule } from '../../vendor/primeface/components/datatable/datatable';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';
import { SharedModule } from '../../vendor/primeface/components/common/shared';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from '../../vendor/primeface/components/paginator/paginator';
import { FormsModule } from '@angular/forms';
import { StoColumnHeadersComponent } from './sto-datatable-header/sto-datatable-header.component';
import { StoDTRadioButton } from './sto-dt-radiobox/sto-dt-radiobox.component';
import { StoTableBody } from './sto-datatable-tbody/sto-datatable-tbody.component';
import { StoColumnFooters } from './sto-datatable-footer/sto-datatable-footer.component';
import { StoScrollableView } from './sto-scrollable-view/sto-scrollable-view.component';
import { StoRowExpansionLoader } from 'ngx-stoui/components/sto-datatable/sto-row-expansion-loader/sto-row-expansion-loader.component';
import { StoDTCheckbox } from './sto-dt-checkbox/sto-dt-checkbox.component';
import {
  StoColumn,
  StoFooterColumnGroup,
  StoHeaderColumnGroup,
  StoSharedModule,
  StoTemplate,
  StoHeader,
  StoFooter
} from '../sto-shared/sto-shared';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sto-datatable',
  templateUrl: 'sto-datatable.component.html',
  styleUrls: ['sto-datatable.component.scss'],
  providers: [DomHandler, ObjectUtils]
})
export class StoDatatableComponent extends DataTable {

  constructor(public el: ElementRef, public domHandler: DomHandler,
              public renderer: Renderer, public changeDetector: ChangeDetectorRef, public objectUtils: ObjectUtils) {
    super(el, domHandler, renderer, changeDetector, objectUtils);
  }

  @ContentChildren(StoTemplate) templates: QueryList<StoTemplate>;
  @ContentChildren(StoColumn) cols: QueryList<StoColumn>;
  @ContentChild(StoHeaderColumnGroup) headerColumnGroup: StoHeaderColumnGroup;
  @ContentChild(StoFooterColumnGroup) footerColumnGroup: StoFooterColumnGroup;
  @ContentChild(StoHeader) header;
  @ContentChild(StoFooter) footer;

}
@NgModule({
  imports: [DataTableModule, CommonModule, SharedModule, PaginatorModule, FormsModule, StoSharedModule],
  exports: [
    SharedModule,
    StoSharedModule,
    StoDatatableComponent,
    StoDTRadioButton,
    StoDTCheckbox,
    StoColumnHeadersComponent,
    StoColumnFooters,
    StoTableBody,
    StoScrollableView,
    StoRowExpansionLoader
  ],
  declarations: [
    StoDatatableComponent,
    StoDTRadioButton,
    StoDTCheckbox,
    StoColumnHeadersComponent,
    StoColumnFooters,
    StoTableBody,
    StoScrollableView,
    StoRowExpansionLoader]
})
export class StoDataTableModule {
}

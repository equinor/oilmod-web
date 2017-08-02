import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  QueryList,
  Renderer,
  ViewEncapsulation
} from '@angular/core';
import { DataTable } from '../../vendor/primeface/components/datatable/datatable';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoColumnHeadersComponent } from './sto-datatable-header/sto-datatable-header.component';
import { StoDTRadioButton } from './sto-dt-radiobox/sto-dt-radiobox.component';
import { StoTableBody } from './sto-datatable-tbody/sto-datatable-tbody.component';
import { StoColumnFooters } from './sto-datatable-footer/sto-datatable-footer.component';
import { StoScrollableView } from './sto-scrollable-view/sto-scrollable-view.component';
import { StoRowExpansionLoader } from '../../components/sto-datatable/sto-row-expansion-loader/sto-row-expansion-loader.component';
import { StoDTCheckbox } from './sto-dt-checkbox/sto-dt-checkbox.component';
import {
  StoColumn,
  StoFooter,
  StoFooterColumnGroup,
  StoHeader,
  StoHeaderColumnGroup,
  StoSharedModule,
  StoTemplate
} from '../sto-shared/sto-shared';
import { StoPaginatorModule } from '../sto-paginator/sto-paginator.component';


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

  @Input() cellStyleClass: Function;
  @ContentChildren(StoTemplate) templates: QueryList<StoTemplate>;
  @ContentChildren(StoColumn) cols: QueryList<StoColumn>;
  @ContentChild(StoHeaderColumnGroup) headerColumnGroup: StoHeaderColumnGroup;
  @ContentChild(StoFooterColumnGroup) footerColumnGroup: StoFooterColumnGroup;
  @ContentChild(StoHeader) header;
  @ContentChild(StoFooter) footer;

  public getCellStyleClass(rowData: any, field: string, existingStyle) {
    let styleClass: string = existingStyle;
    if (this.cellStyleClass) {
      let cellClass = ' ' + this.cellStyleClass.call(this, rowData, field);
      if (cellClass) {
        styleClass += cellClass;
      }
    }
    return styleClass;
  }

  @Output() onCellClick = new EventEmitter<any>();

  handleCellClick(cell: any, column, rowData: any) {
    if (this.editable) {
      this.switchCellToEditMode(cell, column, rowData);
    } else {
      this.onCellClick.emit({
        row: rowData, cell, column
      });
    }
  }

}
@NgModule({
  imports: [CommonModule, StoPaginatorModule, FormsModule, StoSharedModule],
  exports: [
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

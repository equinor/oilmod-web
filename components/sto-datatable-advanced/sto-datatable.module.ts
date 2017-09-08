import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'rxjs/add/observable/fromEvent';

import {
  DatatableComponent,
  DataTableColumnDirective,
  DataTableHeaderComponent,
  DataTableBodyComponent,
  DataTableFooterComponent,
  DataTableHeaderCellComponent,
  DataTableHeaderTitleComponent,
  DataTablePagerComponent,
  DataTableBodyRowComponent,  
  DataTableRowWrapperComponent,
  ProgressBarComponent,
  DataTableBodyCellComponent,
  DatatableRowDetailDirective,
  DatatableGroupHeaderDirective,
  DataTableSelectionComponent,
  DataTableColumnHeaderDirective,
  DataTableColumnCellDirective,
  DatatableRowDetailTemplateDirective,
  DataTableFooterTemplateDirective,
  DatatableFooterDirective,
  DatatableGroupHeaderTemplateDirective
} from '../../vendor/ngx-datatable/components';

import {
  VisibilityDirective,
  LongPressDirective,
  ResizeableDirective,
  OrderableDirective,
  DraggableDirective
} from '../../vendor/ngx-datatable/directives';

import { ScrollbarHelper } from '../../vendor/ngx-datatable/services';
import { StoComplexDatatableComponent } from './components/stoui-complex-datatable.component';
import { StoComplexDataTableHeaderComponent } from './components/header/sto-header.component';
import { StoDataTableBodyComponent } from './components/body/sto-body.component';
import { StoScrollerComponent } from './components/body/sto-scroller.component';
import { DataTableFixedRowWrapperComponent } from './components/body/sto-fixed-body-row-wrapper.component';
import { StoDataTableColumnGroupDirective } from './components/columns/sto-column-title.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ScrollbarHelper
  ],
  declarations: [
    DataTableFooterTemplateDirective,
    VisibilityDirective,
    DraggableDirective,
    ResizeableDirective,
    OrderableDirective,
    LongPressDirective,
    StoScrollerComponent,
    StoComplexDatatableComponent,
    DataTableColumnDirective,
    StoDataTableColumnGroupDirective,
    StoComplexDataTableHeaderComponent,
    DataTableHeaderCellComponent,
    DataTableHeaderTitleComponent,
    StoDataTableBodyComponent,
    DataTableFooterComponent,
    DataTablePagerComponent,
    ProgressBarComponent,    
    DataTableBodyRowComponent,
    DataTableRowWrapperComponent,
    DataTableFixedRowWrapperComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableBodyCellComponent,
    DataTableSelectionComponent,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DatatableFooterDirective,
    DatatableGroupHeaderTemplateDirective
  ],
  exports: [
    StoComplexDatatableComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableColumnDirective,
    StoDataTableColumnGroupDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DataTableFooterTemplateDirective,
    DatatableFooterDirective,
    DataTablePagerComponent,
    DatatableGroupHeaderTemplateDirective
  ]
})
export class NgxDatatableModule { }

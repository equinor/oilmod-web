import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'rxjs/add/observable/fromEvent';

import {
  DataTableBodyCellComponent,
  DataTableSelectionComponent,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DataTableFooterComponent,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  DatatableGroupHeaderDirective,
  DatatableGroupHeaderTemplateDirective,
  DataTableHeaderCellComponent,
  DataTableHeaderTitleComponent,
  DataTablePagerComponent,
  DatatableRowDetailDirective,
  DatatableRowDetailTemplateDirective,
  DataTableRowWrapperComponent,
  ProgressBarComponent
} from '../../vendor/ngx-datatable/components';

import {
  DraggableDirective,
  LongPressDirective,
  OrderableDirective,
  ResizeableDirective,
  VisibilityDirective
} from '../../vendor/ngx-datatable/directives';

import { ScrollbarHelper } from '../../vendor/ngx-datatable/services';
import { StoComplexDatatableComponent } from './components/stoui-complex-datatable.component';
import { StoComplexDataTableHeaderComponent } from './components/header/sto-header.component';
import { StoDataTableBodyComponent } from './components/body/sto-body.component';
import { StoScrollerComponent } from './components/body/sto-scroller.component';
import { DataTableFixedRowWrapperComponent } from './components/body/sto-fixed-body-row-wrapper.component';
import { StoDataTableColumnGroupDirective } from './components/columns/sto-column-title.directive';
import { StoDataTableBodyRowComponent } from './components/body/sto-body-row.component';
import { StoDataTableDateColumnComponent } from './components/columns/sto-date-column.component';
import { StoDataTableNumberColumnComponent } from './components/columns/sto-number-column.component';
import { StoPipesModule } from '../../components/sto-pipes/sto-pipes.module';
import { StoDataTableSelectionComponent } from './components/body/sto-selection.component';
import { StoDataTableBodyCellComponent } from './components/body/sto-body-cell.component';

@NgModule({
  imports: [
    CommonModule,
    StoPipesModule
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
    DataTableBodyCellComponent,
    DataTableSelectionComponent,
    StoComplexDatatableComponent,
    DataTableColumnDirective,
    StoDataTableColumnGroupDirective,
    StoDataTableBodyRowComponent,
    StoComplexDataTableHeaderComponent,
    DataTableHeaderCellComponent,
    DataTableHeaderTitleComponent,
    StoDataTableBodyComponent,
    DataTableFooterComponent,
    DataTablePagerComponent,
    ProgressBarComponent,
    DataTableRowWrapperComponent,
    DataTableFixedRowWrapperComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    StoDataTableBodyCellComponent,
    StoDataTableSelectionComponent,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DatatableFooterDirective,
    DatatableGroupHeaderTemplateDirective,
    StoDataTableDateColumnComponent,
    StoDataTableNumberColumnComponent
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
    DatatableGroupHeaderTemplateDirective,
    StoDataTableDateColumnComponent,
    StoDataTableNumberColumnComponent
  ]
})
export class NgxDatatableModule {
}

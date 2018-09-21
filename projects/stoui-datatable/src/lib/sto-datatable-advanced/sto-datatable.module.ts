import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ScrollbarHelper } from '../vendor/ngx-datatable/services/scrollbar-helper.service';
import { StoComplexDatatableComponent } from './components/stoui-complex-datatable.component';
import { StoComplexDataTableHeaderComponent } from './components/header/sto-header.component';
import { StoDataTableBodyComponent } from './components/body/sto-body.component';
import { StoScrollerComponent } from './components/body/sto-scroller.component';
import { DataTableFixedRowWrapperComponent } from './components/body/sto-fixed-body-row-wrapper.component';
import { StoDataTableColumnGroupDirective } from './components/columns/sto-column-title.directive';
import { StoDataTableBodyRowComponent } from './components/body/sto-body-row.component';
import { StoDataTableDateColumnComponent } from './components/columns/sto-date-column.component';
import { StoDataTableNumberColumnComponent } from './components/columns/sto-number-column.component';
import { StoPipesModule } from '@ngx-stoui/core';
import { StoDataTableSelectionComponent } from './components/body/sto-selection.component';
import { StoDataTableBodyCellComponent } from './components/body/sto-body-cell.component';
import { ResizeableDirective } from './directives/resizeable.directive';
import { LongPressDirective } from './directives/long-press.directive';
import { OrderableDirective } from '../vendor/ngx-datatable/directives/orderable.directive';
import { VisibilityDirective } from '../vendor/ngx-datatable/directives/visibility.directive';
import { DataTableFooterTemplateDirective } from '../vendor/ngx-datatable/components/footer/footer-template.directive';
import { DataTableBodyCellComponent } from '../vendor/ngx-datatable/components/body/body-cell.component';
import { DataTableSelectionComponent } from '../vendor/ngx-datatable/components/body/selection.component';
import { DataTableColumnDirective } from '../vendor/ngx-datatable/components/columns/column.directive';
import { DataTableHeaderCellComponent } from '../vendor/ngx-datatable/components/header/header-cell.component';
import { DataTableHeaderTitleComponent } from '../vendor/ngx-datatable/components/header/header-title.component';
import { DataTableFooterComponent } from '../vendor/ngx-datatable/components/footer/footer.component';
import { DataTablePagerComponent } from '../vendor/ngx-datatable/components/footer/pager.component';
import { ProgressBarComponent } from '../vendor/ngx-datatable/components/body/progress-bar.component';
import { DataTableRowWrapperComponent } from '../vendor/ngx-datatable/components/body/body-row-wrapper.component';
import { DatatableRowDetailDirective } from '../vendor/ngx-datatable/components/row-detail/row-detail.directive';
import { DatatableGroupHeaderDirective } from '../vendor/ngx-datatable/components/body/body-group-header.directive';
import { DatatableRowDetailTemplateDirective } from '../vendor/ngx-datatable/components/row-detail/row-detail-template.directive';
import { DataTableColumnHeaderDirective } from '../vendor/ngx-datatable/components/columns/column-header.directive';
import { DataTableColumnCellDirective } from '../vendor/ngx-datatable/components/columns/column-cell.directive';
import { DatatableFooterDirective } from '../vendor/ngx-datatable/components/footer/footer.directive';
import { DatatableGroupHeaderTemplateDirective } from '../vendor/ngx-datatable/components/body/body-group-header-template.directive';


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

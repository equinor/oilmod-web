"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
require("rxjs/add/observable/fromEvent");
var components_1 = require("../../vendor/ngx-datatable/components");
var directives_1 = require("../../vendor/ngx-datatable/directives");
var services_1 = require("../../vendor/ngx-datatable/services");
var stoui_complex_datatable_component_1 = require("./components/stoui-complex-datatable.component");
var sto_header_component_1 = require("./components/header/sto-header.component");
var sto_body_component_1 = require("./components/body/sto-body.component");
var sto_scroller_component_1 = require("./components/body/sto-scroller.component");
var sto_fixed_body_row_wrapper_component_1 = require("./components/body/sto-fixed-body-row-wrapper.component");
var sto_column_title_directive_1 = require("./components/columns/sto-column-title.directive");
var NgxDatatableModule = (function () {
    function NgxDatatableModule() {
    }
    return NgxDatatableModule;
}());
NgxDatatableModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule
        ],
        providers: [
            services_1.ScrollbarHelper
        ],
        declarations: [
            components_1.DataTableFooterTemplateDirective,
            directives_1.VisibilityDirective,
            directives_1.DraggableDirective,
            directives_1.ResizeableDirective,
            directives_1.OrderableDirective,
            directives_1.LongPressDirective,
            sto_scroller_component_1.StoScrollerComponent,
            stoui_complex_datatable_component_1.StoComplexDatatableComponent,
            components_1.DataTableColumnDirective,
            sto_column_title_directive_1.StoDataTableColumnGroupDirective,
            sto_header_component_1.StoComplexDataTableHeaderComponent,
            components_1.DataTableHeaderCellComponent,
            components_1.DataTableHeaderTitleComponent,
            sto_body_component_1.StoDataTableBodyComponent,
            components_1.DataTableFooterComponent,
            components_1.DataTablePagerComponent,
            components_1.ProgressBarComponent,
            components_1.DataTableBodyRowComponent,
            components_1.DataTableRowWrapperComponent,
            sto_fixed_body_row_wrapper_component_1.DataTableFixedRowWrapperComponent,
            components_1.DatatableRowDetailDirective,
            components_1.DatatableGroupHeaderDirective,
            components_1.DatatableRowDetailTemplateDirective,
            components_1.DataTableBodyCellComponent,
            components_1.DataTableSelectionComponent,
            components_1.DataTableColumnHeaderDirective,
            components_1.DataTableColumnCellDirective,
            components_1.DatatableFooterDirective,
            components_1.DatatableGroupHeaderTemplateDirective
        ],
        exports: [
            stoui_complex_datatable_component_1.StoComplexDatatableComponent,
            components_1.DatatableRowDetailDirective,
            components_1.DatatableGroupHeaderDirective,
            components_1.DatatableRowDetailTemplateDirective,
            components_1.DataTableColumnDirective,
            sto_column_title_directive_1.StoDataTableColumnGroupDirective,
            components_1.DataTableColumnHeaderDirective,
            components_1.DataTableColumnCellDirective,
            components_1.DataTableFooterTemplateDirective,
            components_1.DatatableFooterDirective,
            components_1.DataTablePagerComponent,
            components_1.DatatableGroupHeaderTemplateDirective
        ]
    })
], NgxDatatableModule);
exports.NgxDatatableModule = NgxDatatableModule;

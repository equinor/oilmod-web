"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var datatable_1 = require("../../vendor/primeface/components/datatable/datatable");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var ObjectUtils_1 = require("../../vendor/primeface/components/utils/ObjectUtils");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var sto_dt_radiobox_component_1 = require("./sto-dt-radiobox/sto-dt-radiobox.component");
var sto_row_expansion_loader_component_1 = require("./sto-row-expansion-loader/sto-row-expansion-loader.component");
var sto_dt_checkbox_component_1 = require("./sto-dt-checkbox/sto-dt-checkbox.component");
var sto_shared_1 = require("../sto-shared/sto-shared");
var sto_paginator_component_1 = require("../sto-paginator/sto-paginator.component");
var StoDatatableComponent = (function (_super) {
    __extends(StoDatatableComponent, _super);
    function StoDatatableComponent(el, domHandler, renderer, changeDetector, objectUtils) {
        var _this = _super.call(this, el, domHandler, renderer, changeDetector, objectUtils) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.changeDetector = changeDetector;
        _this.objectUtils = objectUtils;
        _this.onCellClick = new core_1.EventEmitter();
        return _this;
    }
    StoDatatableComponent.prototype.getCellStyleClass = function (rowData, field, existingStyle) {
        var styleClass = existingStyle;
        if (this.cellStyleClass) {
            var cellClass = ' ' + this.cellStyleClass.call(this, rowData, field);
            if (cellClass) {
                styleClass += cellClass;
            }
        }
        return styleClass;
    };
    StoDatatableComponent.prototype.handleCellClick = function (cell, column, rowData) {
        if (this.editable) {
            this.switchCellToEditMode(cell, column, rowData);
        }
        else {
            this.onCellClick.emit({
                row: rowData, cell: cell, column: column
            });
        }
    };
    return StoDatatableComponent;
}(datatable_1.DataTable));
__decorate([
    core_1.Input()
], StoDatatableComponent.prototype, "cellStyleClass", void 0);
__decorate([
    core_1.ContentChildren(sto_shared_1.StoTemplate)
], StoDatatableComponent.prototype, "templates", void 0);
__decorate([
    core_1.ContentChildren(sto_shared_1.StoColumn)
], StoDatatableComponent.prototype, "cols", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoHeaderColumnGroup)
], StoDatatableComponent.prototype, "headerColumnGroup", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoFooterColumnGroup)
], StoDatatableComponent.prototype, "footerColumnGroup", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoHeader)
], StoDatatableComponent.prototype, "header", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoFooter)
], StoDatatableComponent.prototype, "footer", void 0);
__decorate([
    core_1.Output()
], StoDatatableComponent.prototype, "onCellClick", void 0);
StoDatatableComponent = __decorate([
    core_1.Component({
        encapsulation: core_1.ViewEncapsulation.None,
        selector: 'sto-datatable',
        templateUrl: 'sto-datatable.component.html',
        styleUrls: ['sto-datatable.component.scss'],
        providers: [domhandler_1.DomHandler, ObjectUtils_1.ObjectUtils]
    })
], StoDatatableComponent);
exports.StoDatatableComponent = StoDatatableComponent;
var StoColumnHeadersComponent = (function () {
    function StoColumnHeadersComponent(dt) {
        this.dt = dt;
    }
    return StoColumnHeadersComponent;
}());
__decorate([
    core_1.Input('stoColumnHeaders')
], StoColumnHeadersComponent.prototype, "columns", void 0);
StoColumnHeadersComponent = __decorate([
    core_1.Component({
        selector: '[stoColumnHeaders]',
        templateUrl: './sto-datatable-header/sto-datatable-header.component.html'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return StoDatatableComponent; })))
], StoColumnHeadersComponent);
exports.StoColumnHeadersComponent = StoColumnHeadersComponent;
var StoColumnFootersComponent = (function () {
    function StoColumnFootersComponent(dt) {
        this.dt = dt;
    }
    return StoColumnFootersComponent;
}());
__decorate([
    core_1.Input('stoColumnFooters')
], StoColumnFootersComponent.prototype, "columns", void 0);
StoColumnFootersComponent = __decorate([
    core_1.Component({
        selector: '[stoColumnFooters]',
        templateUrl: 'sto-datatable-footer/sto-datatable-footer.component.html'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return StoDatatableComponent; })))
], StoColumnFootersComponent);
exports.StoColumnFootersComponent = StoColumnFootersComponent;
var StoScrollableView = (function (_super) {
    __extends(StoScrollableView, _super);
    function StoScrollableView(dt, domHandler, el, renderer) {
        var _this = _super.call(this, dt, domHandler, el, renderer) || this;
        _this.dt = dt;
        _this.domHandler = domHandler;
        _this.el = el;
        _this.renderer = renderer;
        return _this;
    }
    return StoScrollableView;
}(datatable_1.ScrollableView));
__decorate([
    core_1.Input('stoScrollableView')
], StoScrollableView.prototype, "columns", void 0);
StoScrollableView = __decorate([
    core_1.Component({
        selector: '[stoScrollableView]',
        templateUrl: 'sto-scrollable-view/sto-scrollable-view.component.html'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return StoDatatableComponent; })))
], StoScrollableView);
exports.StoScrollableView = StoScrollableView;
var StoTableBody = (function () {
    function StoTableBody(dt) {
        this.dt = dt;
    }
    StoTableBody.prototype.visibleColumns = function () {
        return this.columns ? this.columns.filter(function (c) { return !c.hidden; }) : [];
    };
    return StoTableBody;
}());
__decorate([
    core_1.Input('stoTableBody')
], StoTableBody.prototype, "columns", void 0);
StoTableBody = __decorate([
    core_1.Component({
        selector: '[stoTableBody]',
        templateUrl: './sto-datatable-tbody/sto-datatable-tbody.component.html'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return StoDatatableComponent; })))
], StoTableBody);
exports.StoTableBody = StoTableBody;
var StoDataTableModule = (function () {
    function StoDataTableModule() {
    }
    return StoDataTableModule;
}());
StoDataTableModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_paginator_component_1.StoPaginatorModule, forms_1.FormsModule, sto_shared_1.StoSharedModule],
        exports: [
            sto_shared_1.StoSharedModule,
            StoDatatableComponent,
            sto_dt_radiobox_component_1.StoDTRadioButton,
            sto_dt_checkbox_component_1.StoDTCheckbox,
            StoColumnHeadersComponent,
            StoColumnFootersComponent,
            StoTableBody,
            StoScrollableView,
            sto_row_expansion_loader_component_1.StoRowExpansionLoader
        ],
        declarations: [
            StoDatatableComponent,
            sto_dt_radiobox_component_1.StoDTRadioButton,
            sto_dt_checkbox_component_1.StoDTCheckbox,
            StoColumnHeadersComponent,
            StoColumnFootersComponent,
            StoTableBody,
            StoScrollableView,
            sto_row_expansion_loader_component_1.StoRowExpansionLoader
        ]
    })
], StoDataTableModule);
exports.StoDataTableModule = StoDataTableModule;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var column_header_directive_1 = require("./column-header.directive");
var column_cell_directive_1 = require("./column-cell.directive");
var DataTableColumnDirective = (function () {
    function DataTableColumnDirective() {
    }
    return DataTableColumnDirective;
}());
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "name", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "prop", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "frozenLeft", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "frozenRight", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "flexGrow", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "resizeable", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "comparator", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "pipe", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "sortable", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "draggable", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "canAutoResize", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "minWidth", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "width", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "maxWidth", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "checkboxable", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "headerCheckboxable", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "headerClass", void 0);
__decorate([
    core_1.Input()
], DataTableColumnDirective.prototype, "cellClass", void 0);
__decorate([
    core_1.Input(),
    core_1.ContentChild(column_cell_directive_1.DataTableColumnCellDirective, { read: core_1.TemplateRef })
], DataTableColumnDirective.prototype, "cellTemplate", void 0);
__decorate([
    core_1.Input(),
    core_1.ContentChild(column_header_directive_1.DataTableColumnHeaderDirective, { read: core_1.TemplateRef })
], DataTableColumnDirective.prototype, "headerTemplate", void 0);
DataTableColumnDirective = __decorate([
    core_1.Directive({ selector: 'ngx-datatable-column' })
], DataTableColumnDirective);
exports.DataTableColumnDirective = DataTableColumnDirective;

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
var common_1 = require("@angular/common");
var sto_shared_1 = require("../sto-shared/sto-shared");
var treetable_1 = require("../../vendor/primeface/components/treetable/treetable");
var StoTreeTableComponent = (function (_super) {
    __extends(StoTreeTableComponent, _super);
    function StoTreeTableComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canSelectChildren = true;
        return _this;
    }
    return StoTreeTableComponent;
}(treetable_1.TreeTable));
__decorate([
    core_1.Input()
], StoTreeTableComponent.prototype, "canSelectChildren", void 0);
__decorate([
    core_1.Input()
], StoTreeTableComponent.prototype, "disableSelectKey", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoHeader)
], StoTreeTableComponent.prototype, "header", void 0);
__decorate([
    core_1.ContentChild(sto_shared_1.StoFooter)
], StoTreeTableComponent.prototype, "footer", void 0);
__decorate([
    core_1.ContentChildren(sto_shared_1.StoColumn)
], StoTreeTableComponent.prototype, "columns", void 0);
StoTreeTableComponent = __decorate([
    core_1.Component({
        selector: 'sto-treeTable',
        styleUrls: ['sto-treetable.component.scss'],
        templateUrl: 'sto-treetable.component.html',
        encapsulation: core_1.ViewEncapsulation.None
    })
], StoTreeTableComponent);
exports.StoTreeTableComponent = StoTreeTableComponent;
var StoUITreeRow = (function (_super) {
    __extends(StoUITreeRow, _super);
    function StoUITreeRow(treeTable) {
        var _this = _super.call(this, treeTable) || this;
        _this.treeTable = treeTable;
        return _this;
    }
    StoUITreeRow.prototype.onRowClick = function (event) {
        if (!this.canSelectChildren && !this.parentNode && !this.isSelectDisabled()) {
            this.treeTable.onRowClick(event, this.node);
        }
        else if (this.canSelectChildren && !this.isSelectDisabled()) {
            this.treeTable.onRowClick(event, this.node);
        }
    };
    StoUITreeRow.prototype.isSelectDisabled = function () {
        return this.node.data[this.disableSelectKey];
    };
    return StoUITreeRow;
}(treetable_1.UITreeRow));
__decorate([
    core_1.Input()
], StoUITreeRow.prototype, "canSelectChildren", void 0);
__decorate([
    core_1.Input()
], StoUITreeRow.prototype, "disableSelectKey", void 0);
StoUITreeRow = __decorate([
    core_1.Component({
        selector: '[stoTreeRow]',
        templateUrl: 'treetable-row/sto-treetable-row.html'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return StoTreeTableComponent; })))
], StoUITreeRow);
exports.StoUITreeRow = StoUITreeRow;
var StoTreeTableModule = (function () {
    function StoTreeTableModule() {
    }
    return StoTreeTableModule;
}());
StoTreeTableModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_shared_1.StoSharedModule],
        exports: [sto_shared_1.StoSharedModule, StoTreeTableComponent, StoUITreeRow],
        declarations: [StoTreeTableComponent, StoUITreeRow]
    })
], StoTreeTableModule);
exports.StoTreeTableModule = StoTreeTableModule;

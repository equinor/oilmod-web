"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var types_1 = require("../../types");
var DataTableHeaderTitleComponent = (function () {
    function DataTableHeaderTitleComponent(cd) {
        this.cd = cd;
        this.select = new core_1.EventEmitter();
        this.columnContextmenu = new core_1.EventEmitter(false);
        this.selectFn = this.select.emit.bind(this.select);
        this.cellContext = {
            column: this.column,
            allRowsSelected: this.allRowsSelected,
            selectFn: this.selectFn
        };
    }
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "column", {
        get: function () {
            return this._column;
        },
        set: function (column) {
            this._column = column;
            this.cellContext.column = column;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "columnCssClasses", {
        get: function () {
            var cls = 'datatable-header-cell';
            if (this.column.sortable) {
                cls += ' sortable';
            }
            if (this.column.resizeable) {
                cls += ' resizeable';
            }
            if (this.column.headerClass) {
                if (typeof this.column.headerClass === 'string') {
                    cls += ' ' + this.column.headerClass;
                }
                else if (typeof this.column.headerClass === 'function') {
                    var res = this.column.headerClass({
                        column: this.column
                    });
                    if (typeof res === 'string') {
                        cls += res;
                    }
                    else if (typeof res === 'object') {
                        var keys = Object.keys(res);
                        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            var k = keys_1[_i];
                            if (res[k] === true) {
                                cls += " " + k;
                            }
                        }
                    }
                }
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "name", {
        get: function () {
            // guaranteed to have a value by setColumnDefaults() in column-helper.ts
            return this.column.headerTemplate === undefined ? this.column.name : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "minWidth", {
        get: function () {
            return this.column.minWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "maxWidth", {
        get: function () {
            return this.column.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "width", {
        get: function () {
            return this.column.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderTitleComponent.prototype, "isCheckboxable", {
        get: function () {
            return this.column.checkboxable &&
                this.column.headerCheckboxable &&
                this.selectionType === types_1.SelectionType.checkbox;
        },
        enumerable: true,
        configurable: true
    });
    DataTableHeaderTitleComponent.prototype.onContextmenu = function ($event) {
        this.columnContextmenu.emit({ event: $event, column: this.column });
    };
    return DataTableHeaderTitleComponent;
}());
__decorate([
    core_1.Input()
], DataTableHeaderTitleComponent.prototype, "allRowsSelected", void 0);
__decorate([
    core_1.Input()
], DataTableHeaderTitleComponent.prototype, "selectionType", void 0);
__decorate([
    core_1.Input()
], DataTableHeaderTitleComponent.prototype, "column", null);
__decorate([
    core_1.HostBinding('style.height.px'),
    core_1.Input()
], DataTableHeaderTitleComponent.prototype, "headerHeight", void 0);
__decorate([
    core_1.Output()
], DataTableHeaderTitleComponent.prototype, "select", void 0);
__decorate([
    core_1.Output()
], DataTableHeaderTitleComponent.prototype, "columnContextmenu", void 0);
__decorate([
    core_1.HostBinding('class')
], DataTableHeaderTitleComponent.prototype, "columnCssClasses", null);
__decorate([
    core_1.HostBinding('attr.title')
], DataTableHeaderTitleComponent.prototype, "name", null);
__decorate([
    core_1.HostBinding('style.minWidth.px')
], DataTableHeaderTitleComponent.prototype, "minWidth", null);
__decorate([
    core_1.HostBinding('style.maxWidth.px')
], DataTableHeaderTitleComponent.prototype, "maxWidth", null);
__decorate([
    core_1.HostBinding('style.width.px')
], DataTableHeaderTitleComponent.prototype, "width", null);
__decorate([
    core_1.HostListener('contextmenu', ['$event'])
], DataTableHeaderTitleComponent.prototype, "onContextmenu", null);
DataTableHeaderTitleComponent = __decorate([
    core_1.Component({
        selector: 'datatable-header-title',
        template: "\n\t  <div>\n\t\t \n\t\t  <span\n\t\t\t\t  *ngIf=\"!column.headerTemplate\"\n\t\t\t\t  class=\"datatable-header-cell-wrapper\">\n        <span\n\t\t\t\tclass=\"datatable-header-cell-label\"\n\t\t\t\t[innerHTML]=\"name\">\n        </span>\n      </span>\n\t\t  <ng-template\n\t\t\t\t  *ngIf=\"column.headerTemplate\"\n\t\t\t\t  [ngTemplateOutlet]=\"column.headerTemplate\"\n\t\t\t\t  [ngTemplateOutletContext]=\"cellContext\">\n\t\t  </ng-template>\n\t\t  <span>\n      </span>\n\t  </div>\n  ",
        host: {
            class: 'datatable-header-title'
        },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    })
], DataTableHeaderTitleComponent);
exports.DataTableHeaderTitleComponent = DataTableHeaderTitleComponent;

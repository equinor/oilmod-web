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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../../../../vendor/ngx-datatable//utils");
var _1 = require("../../../../vendor/ngx-datatable/");
var StoComplexDataTableHeaderComponent = (function (_super) {
    __extends(StoComplexDataTableHeaderComponent, _super);
    function StoComplexDataTableHeaderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(StoComplexDataTableHeaderComponent.prototype, "innerWidth", {
        get: function () {
            return this._innerWidth;
        },
        set: function (val) {
            this._innerWidth = val;
            if (this._columns) {
                var colByPin = utils_1.columnsByPin(this._columns);
                this.columnGroupWidths = utils_1.columnGroupWidths(colByPin, this._columns);
                if (this._columnGroups) {
                    this._columnGroups.forEach(function (columnGroup) {
                        columnGroup.width = utils_1.columnTotalWidth(columnGroup.columns);
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StoComplexDataTableHeaderComponent.prototype, "columns", {
        set: function (val) {
            this._columns = val;
            var colsByPin = utils_1.columnsByPin(val);
            this.columnsByPin = utils_1.columnsByPinArr(val);
            this.columnGroupWidths = utils_1.columnGroupWidths(colsByPin, val);
            if (this._columnGroups) {
                this._columnGroups.forEach(function (columnGroup) {
                    columnGroup.width = utils_1.columnTotalWidth(columnGroup.columns);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    StoComplexDataTableHeaderComponent.prototype.setColumnHeaderDefaults = function (columnHeaders) {
        var _loop_1 = function (ii) {
            var columnHeader = columnHeaders[ii];
            if (this_1._columns) {
                columnHeader.columns = this_1._columns.filter(function (column) { return columnHeader.properties.indexOf(column.prop) > -1; });
            }
        };
        var this_1 = this;
        for (var ii = 0; ii < columnHeaders.length; ii++) {
            _loop_1(ii);
        }
    };
    Object.defineProperty(StoComplexDataTableHeaderComponent.prototype, "columnGroups", {
        get: function () {
            return this._columnGroups;
        },
        set: function (val) {
            this._columnGroups = val;
            if (val) {
                this.setColumnHeaderDefaults(this._columnGroups);
                this._columnGroups.forEach(function (columnGroup) {
                    columnGroup.width = utils_1.columnTotalWidth(columnGroup.columns);
                });
                this.columnGroupByPin = utils_1.columnsByPin(val);
            }
        },
        enumerable: true,
        configurable: true
    });
    return StoComplexDataTableHeaderComponent;
}(_1.DataTableHeaderComponent));
__decorate([
    core_1.Input()
], StoComplexDataTableHeaderComponent.prototype, "innerWidth", null);
__decorate([
    core_1.Input()
], StoComplexDataTableHeaderComponent.prototype, "columns", null);
__decorate([
    core_1.Input()
], StoComplexDataTableHeaderComponent.prototype, "columnGroups", null);
StoComplexDataTableHeaderComponent = __decorate([
    core_1.Component({
        selector: 'sto-complex-header',
        template: "\n\t  <div\n\t\t\t  orderable\n\t\t\t  (reorder)=\"onColumnReordered($event)\"\n\t\t\t  [style.width.px]=\"columnGroupWidths.total\"\n\t\t\t  class=\"datatable-header-inner\">\n\n\t\t  <div\n\t\t\t\t  *ngFor=\"let colGroup of columnsByPin; trackBy: trackByGroups\"\n\t\t\t\t  [class]=\"'datatable-row-' + colGroup.type\"\n\t\t\t\t  [ngStyle]=\"stylesByGroup(colGroup.type)\">\n\t\t\t  <div class=\"datatable-header-column-group\" *ngIf=\"columnGroups\">\n\t\t\t\t  <div class=\"datatable-header-cell\" style=\"display: inline-block\"\n\t\t\t\t\t   [style.width]=\"columnGroup.width+'px'\" *ngFor=\"let columnGroup of \n\t\t\t\t         columnGroupByPin[colGroup.type]\">\n\t\t\t\t\t  {{columnGroup.name}}\n\t\t\t\t  </div>\n\t\t\t  </div>\n\t\t\t  <datatable-header-cell\n\t\t\t\t\t  *ngFor=\"let column of colGroup.columns; trackBy: columnTrackingFn\"\n\t\t\t\t\t  resizeable\n\t\t\t\t\t  [resizeEnabled]=\"column.resizeable\"\n\t\t\t\t\t  (resize)=\"onColumnResized($event, column)\"\n\t\t\t\t\t  long-press\n\t\t\t\t\t  [pressModel]=\"column\"\n\t\t\t\t\t  [pressEnabled]=\"reorderable && column.draggable\"\n\t\t\t\t\t  (longPressStart)=\"onLongPressStart($event)\"\n\t\t\t\t\t  (longPressEnd)=\"onLongPressEnd($event)\"\n\t\t\t\t\t  draggable\n\t\t\t\t\t  [dragX]=\"reorderable && column.draggable && column.dragging\"\n\t\t\t\t\t  [dragY]=\"false\"\n\t\t\t\t\t  [dragModel]=\"column\"\n\t\t\t\t\t  [dragEventTarget]=\"dragEventTarget\"\n\t\t\t\t\t  [headerHeight]=\"headerHeight\"\n\t\t\t\t\t  [column]=\"column\"\n\t\t\t\t\t  [sortType]=\"sortType\"\n\t\t\t\t\t  [sorts]=\"sorts\"\n\t\t\t\t\t  [selectionType]=\"selectionType\"\n\t\t\t\t\t  [sortAscendingIcon]=\"sortAscendingIcon\"\n\t\t\t\t\t  [sortDescendingIcon]=\"sortDescendingIcon\"\n\t\t\t\t\t  [allRowsSelected]=\"allRowsSelected\"\n\t\t\t\t\t  (sort)=\"onSort($event)\"\n\t\t\t\t\t  (select)=\"select.emit($event)\"\n\t\t\t\t\t  (columnContextmenu)=\"columnContextmenu.emit($event)\">\n\t\t\t  </datatable-header-cell>\n\t\t  </div>\n      \n\t  </div>\n  ",
        host: {
            class: 'datatable-header'
        }
    })
], StoComplexDataTableHeaderComponent);
exports.StoComplexDataTableHeaderComponent = StoComplexDataTableHeaderComponent;

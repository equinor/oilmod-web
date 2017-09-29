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
var utils_1 = require("../../../../vendor/ngx-datatable/utils");
var body_component_1 = require("../../../../vendor/ngx-datatable/components/body/body.component");
var column_helper_1 = require("../../../../vendor/ngx-datatable/utils/column-helper");
var StoDataTableBodyComponent = (function (_super) {
    __extends(StoDataTableBodyComponent, _super);
    /**
     * Creates an instance of DataTableBodyComponent.
     */
    function StoDataTableBodyComponent(cd, elRef) {
        // declare fn here so we can get access to the `this` property
        return _super.call(this, cd, elRef) || this;
    }
    StoDataTableBodyComponent.prototype.getRowSummaryStyle = function () {
        var summaryHeight = 36;
        var scroll = 0;
        var style = {
            position: 'fixed'
        };
        var height = parseInt(this.bodyHeight, 0);
        var width = parseInt(this.bodyWidth, 0);
        var colWidth = (this.columns.map(function (c) { return c.width; }).reduce(function (r, s) { return r + s; }, 0));
        if (colWidth > width) {
            scroll = 17;
        }
        utils_1.translateXY(style, 0, height - summaryHeight - scroll);
        return style;
    };
    Object.defineProperty(StoDataTableBodyComponent.prototype, "summaryColumns", {
        get: function () {
            return this._summaryColumns;
        },
        set: function (val) {
            column_helper_1.setColumnDefaults(val);
            this._summaryColumns = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StoDataTableBodyComponent.prototype, "summaryRowData", {
        get: function () {
            return this._summaryRowData;
        },
        set: function (val) {
            this._summaryRowData = val;
        },
        enumerable: true,
        configurable: true
    });
    StoDataTableBodyComponent.prototype.getFooterRowClass = function () {
        return 'datatable-footer-summary-row';
    };
    return StoDataTableBodyComponent;
}(body_component_1.DataTableBodyComponent));
__decorate([
    core_1.Input()
], StoDataTableBodyComponent.prototype, "summaryColumns", null);
__decorate([
    core_1.Input()
], StoDataTableBodyComponent.prototype, "summaryRowData", null);
StoDataTableBodyComponent = __decorate([
    core_1.Component({
        selector: 'sto-complex-body',
        template: "\n\t  <datatable-selection\n\t\t\t  #selector\n\t\t\t  [selected]=\"selected\"\n\t\t\t  [rows]=\"temp\"\n\t\t\t  [selectCheck]=\"selectCheck\"\n\t\t\t  [selectEnabled]=\"selectEnabled\"\n\t\t\t  [selectionType]=\"selectionType\"\n\t\t\t  [rowIdentity]=\"rowIdentity\"\n\t\t\t  (select)=\"select.emit($event)\"\n\t\t\t  (activate)=\"activate.emit($event)\">\n\t\t  <datatable-progress\n\t\t\t\t  *ngIf=\"loadingIndicator\">\n\t\t  </datatable-progress>\n\t\t  <sto-datatable-scroller\n\t\t\t\t  *ngIf=\"rows?.length\"\n\t\t\t\t  [scrollbarV]=\"scrollbarV\"\n\t\t\t\t  [scrollbarH]=\"scrollbarH\"\n\t\t\t\t  [scrollHeight]=\"scrollHeight\"\n\t\t\t\t  [scrollWidth]=\"columnGroupWidths.total\"\n\t\t\t\t  (scroll)=\"onBodyScroll($event)\"\n          [offset]=\"36\"\n      >\n\t\t\t  <datatable-row-wrapper\n\t\t\t\t\t  [groupedRows]=\"groupedRows\"\n\t\t\t\t\t  *ngFor=\"let group of temp; let i = index; trackBy: rowTrackingFn;\"\n\t\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t\t  [ngStyle]=\"getRowsStyles(group)\"\n\t\t\t\t\t  [rowDetail]=\"rowDetail\"\n\t\t\t\t\t  [groupHeader]=\"groupHeader\"\n\t\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t\t  [detailRowHeight]=\"getDetailRowHeight(group[i],i)\"\n\t\t\t\t\t  [row]=\"group\"\n\t\t\t\t\t  [expanded]=\"getRowExpanded(group)\"\n\t\t\t\t\t  [rowIndex]=\"getRowIndex(group[i])\"\n\t\t\t\t\t  (rowContextmenu)=\"rowContextmenu.emit($event)\">\n\t\t\t\t  <datatable-body-row\n\t\t\t\t\t\t  *ngIf=\"!group.value\"\n\t\t\t\t\t\t  tabindex=\"-1\"\n\t\t\t\t\t\t  [isSelected]=\"selector.getRowSelected(group)\"\n\t\t\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t\t\t  [columns]=\"columns\"\n\t\t\t\t\t\t  [rowHeight]=\"getRowHeight(group)\"\n\t\t\t\t\t\t  [row]=\"group\"\n\t\t\t\t\t\t  [rowIndex]=\"getRowIndex(group)\"\n\t\t\t\t\t\t  [expanded]=\"getRowExpanded(group)\"\n\t\t\t\t\t\t  [rowClass]=\"rowClass\"\n\t\t\t\t\t\t  (activate)=\"selector.onActivate($event, i)\">\n\t\t\t\t  </datatable-body-row>\n\t\t\t\t  <datatable-body-row\n\t\t\t\t\t\t  *ngFor=\"let row of group.value; let i = index; trackBy: rowTrackingFn;\"\n\t\t\t\t\t\t  tabindex=\"-1\"\n\t\t\t\t\t\t  [isSelected]=\"selector.getRowSelected(row)\"\n\t\t\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t\t\t  [columns]=\"columns\"\n\t\t\t\t\t\t  [rowHeight]=\"getRowHeight(row)\"\n\t\t\t\t\t\t  [row]=\"row\"\n\t\t\t\t\t\t  [group]=\"group.value\"\n\t\t\t\t\t\t  [rowIndex]=\"getRowIndex(row)\"\n\t\t\t\t\t\t  [expanded]=\"getRowExpanded(row)\"\n\t\t\t\t\t\t  [rowClass]=\"rowClass\"\n\t\t\t\t\t\t  (activate)=\"selector.onActivate($event, i)\">\n\t\t\t\t  </datatable-body-row>\n\t\t\t  </datatable-row-wrapper>\n\t\t\t  <sto-datatable-fixed-row-wrapper\n\t\t\t\t\t  *ngIf=\"summaryRowData\"\n\t\t\t\t\t  [ngStyle]=\"getRowSummaryStyle()\"\n\t\t\t  >\n\t\t\t\t  <datatable-body-row\n\t\t\t\t\t\t  tabindex=\"-1\"\n\t\t\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t\t\t  [row]=\"summaryRowData\"\n\t\t\t\t\t\t  [columns]=\"summaryColumns\"\n\t\t\t\t\t\t  [rowHeight]=\"36\"\n\t\t\t\t\t\t  [rowClass]=\"getFooterRowClass\"\n\t\t\t\t  >\n\t\t\t\t  </datatable-body-row>\n\t\t\t  </sto-datatable-fixed-row-wrapper>\n\t\t  </sto-datatable-scroller>\n\t\t  <div\n\t\t\t\t  class=\"empty-row\"\n\t\t\t\t  *ngIf=\"!rows?.length\"\n\t\t\t\t  [innerHTML]=\"emptyMessage\">\n\t\t  </div>\n\t  </datatable-selection>\n\n\n  ",
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        host: {
            class: 'datatable-body'
        }
    })
], StoDataTableBodyComponent);
exports.StoDataTableBodyComponent = StoDataTableBodyComponent;

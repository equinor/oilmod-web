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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../../../vendor/ngx-datatable/utils");
var sto_column_title_directive_1 = require("./columns/sto-column-title.directive");
var datatable_component_1 = require("../../../vendor/ngx-datatable/components/datatable.component");
var column_1 = require("../../../vendor/ngx-datatable/utils/column");
var StoComplexDatatableComponent = (function (_super) {
    __extends(StoComplexDatatableComponent, _super);
    function StoComplexDatatableComponent(scrollbarHelper, cd, element, differs) {
        return _super.call(this, scrollbarHelper, cd, element, differs) || this;
    }
    Object.defineProperty(StoComplexDatatableComponent.prototype, "summaryRow", {
        set: function (val) {
            if (val) {
                this.linkColumns(val.columns, this._internalColumns);
                this._internalSummaryColumns = val.columns;
                this._internalSummaryRowData = val.data;
            }
        },
        enumerable: true,
        configurable: true
    });
    StoComplexDatatableComponent.prototype.linkColumns = function (summaryColumns, columns) {
        var _loop_1 = function (ii) {
            var summaryColumn = summaryColumns[ii];
            if (columns) {
                if (summaryColumn.props) {
                    summaryColumn.columns = columns.filter(function (column) { return summaryColumn.props.indexOf(column.prop) > -1; });
                }
                else {
                    summaryColumn.columns = columns.filter(function (column) { return summaryColumn.prop === column.prop; });
                }
            }
        };
        for (var ii = 0; ii < summaryColumns.length; ii++) {
            _loop_1(ii);
        }
        this.setSummaryRowCellWidth(summaryColumns);
    };
    StoComplexDatatableComponent.prototype.setSummaryRowCellWidth = function (summaryColumns) {
        summaryColumns.forEach(function (columnGroup) {
            columnGroup.width = column_1.columnTotalWidth(columnGroup.columns);
        });
    };
    Object.defineProperty(StoComplexDatatableComponent.prototype, "columnGroupTemplates", {
        /**
         * Returns the column templates.
         */
        get: function () {
            return this._columnGroupTemplates;
        },
        set: function (val) {
            this._columnGroupTemplates = val;
            if (val) {
                // only set this if results were brought back
                var arr = val.toArray();
                if (arr.length) {
                    // translate them to normal objects
                    this._internalColumnGroups = utils_1.translateTemplates(arr);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    StoComplexDatatableComponent.prototype.recalculate = function () {
        this.recalculateDims();
        this.recalculateColumns();
        if (this._internalSummaryColumns) {
            this.linkColumns(this._internalSummaryColumns, this._internalColumns);
        }
    };
    StoComplexDatatableComponent.prototype.onColumnResize = function (_a) {
        var column = _a.column, newValue = _a.newValue;
        _super.prototype.onColumnResize.call(this, { column: column, newValue: newValue });
        this.resizeSummaryColumns(column, newValue);
    };
    StoComplexDatatableComponent.prototype.resizeSummaryColumns = function (column, newValue) {
        var cols = this._internalSummaryColumns.map(function (c, i) {
            c = __assign({}, c);
            if (c.$$id === column.$$id) {
                c.width = newValue;
                // set this so we can force the column
                // width distribution to be to this value
                c.$$oldWidth = newValue;
            }
            return c;
        });
        this.linkColumns(cols, this._internalColumns);
        this._internalSummaryColumns = cols;
    };
    return StoComplexDatatableComponent;
}(datatable_component_1.DatatableComponent));
__decorate([
    core_1.Input()
], StoComplexDatatableComponent.prototype, "summaryRow", null);
__decorate([
    core_1.ContentChildren(sto_column_title_directive_1.StoDataTableColumnGroupDirective)
], StoComplexDatatableComponent.prototype, "columnGroupTemplates", null);
StoComplexDatatableComponent = __decorate([
    core_1.Component({
        selector: 'sto-complex-datatable',
        template: "\n\t  <div\n\t\t\t  visibilityObserver\n\t\t\t  (visible)=\"recalculate()\">\n\t\t  <sto-complex-header\n\t\t\t\t  *ngIf=\"headerHeight\"\n\t\t\t\t  [sorts]=\"sorts\"\n\t\t\t\t  [sortType]=\"sortType\"\n\t\t\t\t  [scrollbarH]=\"scrollbarH\"\n\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t  [dealsWithGroup]=\"groupedRows\"\n\t\t\t\t  [columns]=\"_internalColumns\"\n\t\t\t\t  [columnGroups]=\"_internalColumnGroups\"\n\t\t\t\t  [headerHeight]=\"headerHeight\"\n\t\t\t\t  [reorderable]=\"reorderable\"\n\t\t\t\t  [sortAscendingIcon]=\"cssClasses.sortAscending\"\n\t\t\t\t  [sortDescendingIcon]=\"cssClasses.sortDescending\"\n\t\t\t\t  [allRowsSelected]=\"allRowsSelected\"\n\t\t\t\t  [selectionType]=\"selectionType\"\n\t\t\t\t  (sort)=\"onColumnSort($event)\"\n\t\t\t\t  (resize)=\"onColumnResize($event)\"\n\t\t\t\t  (reorder)=\"onColumnReorder($event)\"\n\t\t\t\t  (select)=\"onHeaderSelect($event)\"\n\t\t\t\t  (columnContextmenu)=\"onColumnContextmenu($event)\">\n\t\t  </sto-complex-header>\n\t\t  <sto-complex-body\n\t\t\t\t  [groupRowsBy]=\"groupRowsBy\"\n\t\t\t\t  [groupedRows]=\"groupedRows\"\n\t\t\t\t  [rows]=\"_internalRows\"\n\t\t\t\t  [groupExpansionDefault]=\"groupExpansionDefault\"\n\t\t\t\t  [scrollbarV]=\"scrollbarV\"\n\t\t\t\t  [scrollbarH]=\"scrollbarH\"\n\t\t\t\t  [loadingIndicator]=\"loadingIndicator\"\n\t\t\t\t  [externalPaging]=\"externalPaging\"\n\t\t\t\t  [rowHeight]=\"rowHeight\"\n\t\t\t\t  [rowCount]=\"rowCount\"\n\t\t\t\t  [offset]=\"offset\"\n\t\t\t\t  [trackByProp]=\"trackByProp\"\n\t\t\t\t  [columns]=\"_internalColumns\"\n\t\t\t\t  [pageSize]=\"pageSize\"\n\t\t\t\t  [offsetX]=\"offsetX\"\n\t\t\t\t  [rowDetail]=\"rowDetail\"\n\t\t\t\t  [groupHeader]=\"groupHeader\"\n\t\t\t\t  [selected]=\"selected\"\n\t\t\t\t  [innerWidth]=\"innerWidth\"\n\t\t\t\t  [bodyHeight]=\"bodyHeight\"\n\t\t\t\t  [selectionType]=\"selectionType\"\n\t\t\t\t  [emptyMessage]=\"messages.emptyMessage\"\n\t\t\t\t  [rowIdentity]=\"rowIdentity\"\n\t\t\t\t  [rowClass]=\"rowClass\"\n\t\t\t\t  [selectCheck]=\"selectCheck\"\n\t\t\t\t  (page)=\"onBodyPage($event)\"\n\t\t\t\t  (activate)=\"activate.emit($event)\"\n\t\t\t\t  (rowContextmenu)=\"onRowContextmenu($event)\"\n\t\t\t\t  (select)=\"onBodySelect($event)\"\n\t\t\t\t  (scroll)=\"onBodyScroll($event)\"\n\t\t\t\t  [summaryRowData]=\"_internalSummaryRowData\"\n\t\t\t\t  [summaryColumns]=\"_internalSummaryColumns\"\n\t\t  >\n\t\t  </sto-complex-body>\n\t\t  <datatable-footer\n\t\t\t\t  *ngIf=\"footerHeight\"\n\t\t\t\t  [rowCount]=\"rowCount\"\n\t\t\t\t  [pageSize]=\"pageSize\"\n\t\t\t\t  [offset]=\"offset\"\n\t\t\t\t  [footerHeight]=\"footerHeight\"\n\t\t\t\t  [footerTemplate]=\"footer\"\n\t\t\t\t  [totalMessage]=\"messages.totalMessage\"\n\t\t\t\t  [pagerLeftArrowIcon]=\"cssClasses.pagerLeftArrow\"\n\t\t\t\t  [pagerRightArrowIcon]=\"cssClasses.pagerRightArrow\"\n\t\t\t\t  [pagerPreviousIcon]=\"cssClasses.pagerPrevious\"\n\t\t\t\t  [selectedCount]=\"selected.length\"\n\t\t\t\t  [selectedMessage]=\"!!selectionType && messages.selectedMessage\"\n\t\t\t\t  [pagerNextIcon]=\"cssClasses.pagerNext\"\n\t\t\t\t  (page)=\"onFooterPage($event)\">\n\t\t  </datatable-footer>\n\t  </div>\n  ",
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        encapsulation: core_1.ViewEncapsulation.None,
        styleUrls: ['../../../vendor/ngx-datatable/components/datatable.component.scss'],
        host: {
            class: 'ngx-datatable'
        }
    })
], StoComplexDatatableComponent);
exports.StoComplexDatatableComponent = StoComplexDatatableComponent;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../../utils");
var DataTableBodyRowComponent = (function () {
    function DataTableBodyRowComponent(differs, scrollbarHelper, cd, element) {
        this.differs = differs;
        this.scrollbarHelper = scrollbarHelper;
        this.cd = cd;
        this.activate = new core_1.EventEmitter();
        this.element = element.nativeElement;
        this.rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (val) {
            this._columns = val;
            this.recalculateColumns(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "innerWidth", {
        get: function () {
            return this._innerWidth;
        },
        set: function (val) {
            if (this._columns) {
                var colByPin = utils_1.columnsByPin(this._columns);
                this.columnGroupWidths = utils_1.columnGroupWidths(colByPin, colByPin);
            }
            this._innerWidth = val;
            this.recalculateColumns();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "cssClass", {
        get: function () {
            var cls = 'datatable-body-row';
            if (this.isSelected)
                cls += ' active';
            if (this.rowIndex % 2 !== 0)
                cls += ' datatable-row-odd';
            if (this.rowIndex % 2 === 0)
                cls += ' datatable-row-even';
            if (this.rowClass) {
                var res = this.rowClass(this.row);
                if (typeof res === 'string') {
                    cls += " " + res;
                }
                else if (typeof res === 'object') {
                    var keys = Object.keys(res);
                    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        var k = keys_1[_i];
                        if (res[k] === true)
                            cls += " " + k;
                    }
                }
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columnsTotalWidths", {
        get: function () {
            return this.columnGroupWidths.total;
        },
        enumerable: true,
        configurable: true
    });
    DataTableBodyRowComponent.prototype.ngDoCheck = function () {
        if (this.rowDiffer.diff(this.row)) {
            this.cd.markForCheck();
        }
    };
    DataTableBodyRowComponent.prototype.trackByGroups = function (index, colGroup) {
        return colGroup.type;
    };
    DataTableBodyRowComponent.prototype.columnTrackingFn = function (index, column) {
        return column.$$id;
    };
    DataTableBodyRowComponent.prototype.stylesByGroup = function (group) {
        var isSummary = false; //TODO FOR DEMO 13.09.2017 only. Move body-row to sto-body-fixed-row!
        if (this.element.classList.contains('datatable-footer-summary-row')) {
            isSummary = true;
        }
        var widths = this.columnGroupWidths;
        var offsetX = this.offsetX;
        var styles = {
            width: widths[group] + "px"
        };
        if (isSummary) {
            if (group !== 'left') {
                utils_1.translateXY(styles, offsetX * -1, 0);
            }
        }
        else {
            if (group === 'left') {
                utils_1.translateXY(styles, offsetX, 0);
            }
            else if (group === 'right') {
                var bodyWidth = parseInt(this.innerWidth + '', 0);
                var totalDiff = widths.total - bodyWidth;
                var offsetDiff = totalDiff - offsetX;
                var offset = (offsetDiff + this.scrollbarHelper.width) * -1;
                utils_1.translateXY(styles, offset, 0);
            }
        }
        return styles;
    };
    DataTableBodyRowComponent.prototype.onActivate = function (event, index) {
        event.cellIndex = index;
        event.rowElement = this.element;
        this.activate.emit(event);
    };
    DataTableBodyRowComponent.prototype.onKeyDown = function (event) {
        var keyCode = event.keyCode;
        var isTargetRow = event.target === this.element;
        var isAction = keyCode === utils_1.Keys.return ||
            keyCode === utils_1.Keys.down ||
            keyCode === utils_1.Keys.up ||
            keyCode === utils_1.Keys.left ||
            keyCode === utils_1.Keys.right;
        if (isAction && isTargetRow) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event: event,
                row: this.row,
                rowElement: this.element
            });
        }
    };
    DataTableBodyRowComponent.prototype.onMouseenter = function (event) {
        this.activate.emit({
            type: 'mouseenter',
            event: event,
            row: this.row,
            rowElement: this.element
        });
    };
    DataTableBodyRowComponent.prototype.recalculateColumns = function (val) {
        if (val === void 0) { val = this.columns; }
        this._columns = val;
        var colsByPin = utils_1.columnsByPin(this._columns);
        this.columnsByPin = utils_1.allColumnsByPinArr(this._columns);
        this.columnGroupWidths = utils_1.columnGroupWidths(colsByPin, this._columns);
    };
    return DataTableBodyRowComponent;
}());
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "columns", null);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "innerWidth", null);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "expanded", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "rowClass", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "row", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "group", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "offsetX", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "isSelected", void 0);
__decorate([
    core_1.Input()
], DataTableBodyRowComponent.prototype, "rowIndex", void 0);
__decorate([
    core_1.HostBinding('class')
], DataTableBodyRowComponent.prototype, "cssClass", null);
__decorate([
    core_1.HostBinding('style.height.px'),
    core_1.Input()
], DataTableBodyRowComponent.prototype, "rowHeight", void 0);
__decorate([
    core_1.HostBinding('style.width.px')
], DataTableBodyRowComponent.prototype, "columnsTotalWidths", null);
__decorate([
    core_1.Output()
], DataTableBodyRowComponent.prototype, "activate", void 0);
__decorate([
    core_1.HostListener('keydown', ['$event'])
], DataTableBodyRowComponent.prototype, "onKeyDown", null);
__decorate([
    core_1.HostListener('mouseenter', ['$event'])
], DataTableBodyRowComponent.prototype, "onMouseenter", null);
DataTableBodyRowComponent = __decorate([
    core_1.Component({
        selector: 'datatable-body-row',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: "\n    <div\n      *ngFor=\"let colGroup of columnsByPin; let i = index; trackBy: trackByGroups\"\n      class=\"datatable-row-{{colGroup.type}} datatable-row-group\"\n      [ngStyle]=\"stylesByGroup(colGroup.type)\">\n      <datatable-body-cell\n        *ngFor=\"let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn\"\n        tabindex=\"-1\"\n        [row]=\"row\"\n        [group]=\"group\"\n        [expanded]=\"expanded\"\n        [isSelected]=\"isSelected\"\n        [rowIndex]=\"rowIndex\"\n        [column]=\"column\"\n        [rowHeight]=\"rowHeight\"\n        (activate)=\"onActivate($event, ii)\">\n      </datatable-body-cell>\n    </div>      \n  "
    })
], DataTableBodyRowComponent);
exports.DataTableBodyRowComponent = DataTableBodyRowComponent;

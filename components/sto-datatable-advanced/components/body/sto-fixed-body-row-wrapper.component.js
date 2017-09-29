"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DataTableFixedRowWrapperComponent = (function () {
    function DataTableFixedRowWrapperComponent(cd, differs) {
        this.cd = cd;
        this.differs = differs;
        this.rowContextmenu = new core_1.EventEmitter(false);
        this.groupContext = {
            group: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this.rowContext = {
            row: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this._expanded = false;
        this.rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableFixedRowWrapperComponent.prototype, "rowIndex", {
        get: function () {
            return this._rowIndex;
        },
        set: function (val) {
            this._rowIndex = val;
            this.rowContext.rowIndex = val;
            this.groupContext.rowIndex = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableFixedRowWrapperComponent.prototype, "expanded", {
        get: function () {
            return this._expanded;
        },
        set: function (val) {
            this._expanded = val;
            this.groupContext.expanded = val;
            this.rowContext.expanded = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    DataTableFixedRowWrapperComponent.prototype.ngDoCheck = function () {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    };
    DataTableFixedRowWrapperComponent.prototype.onContextmenu = function ($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    };
    DataTableFixedRowWrapperComponent.prototype.getGroupHeaderStyle = function (group) {
        var styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    };
    return DataTableFixedRowWrapperComponent;
}());
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "innerWidth", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "rowDetail", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "groupHeader", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "offsetX", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "detailRowHeight", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "row", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "groupedRows", void 0);
__decorate([
    core_1.Output()
], DataTableFixedRowWrapperComponent.prototype, "rowContextmenu", void 0);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "rowIndex", null);
__decorate([
    core_1.Input()
], DataTableFixedRowWrapperComponent.prototype, "expanded", null);
__decorate([
    core_1.HostListener('contextmenu', ['$event'])
], DataTableFixedRowWrapperComponent.prototype, "onContextmenu", null);
DataTableFixedRowWrapperComponent = __decorate([
    core_1.Component({
        selector: 'sto-datatable-fixed-row-wrapper',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: "\n\t  <ng-content></ng-content>\n  ",
        host: {
            class: 'datatable-row-wrapper'
        }
    })
], DataTableFixedRowWrapperComponent);
exports.DataTableFixedRowWrapperComponent = DataTableFixedRowWrapperComponent;

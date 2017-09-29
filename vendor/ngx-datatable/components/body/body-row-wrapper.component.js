"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DataTableRowWrapperComponent = (function () {
    function DataTableRowWrapperComponent(cd, differs) {
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
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "rowIndex", {
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
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "expanded", {
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
    DataTableRowWrapperComponent.prototype.ngDoCheck = function () {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    };
    DataTableRowWrapperComponent.prototype.onContextmenu = function ($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    };
    DataTableRowWrapperComponent.prototype.getGroupHeaderStyle = function (group) {
        var styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    };
    return DataTableRowWrapperComponent;
}());
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "innerWidth", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "rowDetail", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "groupHeader", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "offsetX", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "detailRowHeight", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "row", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "groupedRows", void 0);
__decorate([
    core_1.Output()
], DataTableRowWrapperComponent.prototype, "rowContextmenu", void 0);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "rowIndex", null);
__decorate([
    core_1.Input()
], DataTableRowWrapperComponent.prototype, "expanded", null);
__decorate([
    core_1.HostListener('contextmenu', ['$event'])
], DataTableRowWrapperComponent.prototype, "onContextmenu", null);
DataTableRowWrapperComponent = __decorate([
    core_1.Component({
        selector: 'datatable-row-wrapper',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: "\n    <div \n      *ngIf=\"groupHeader && groupHeader.template\"\n      class=\"datatable-group-header\"\n      [ngStyle]=\"getGroupHeaderStyle()\">\n      <ng-template\n        *ngIf=\"groupHeader && groupHeader.template\"\n        [ngTemplateOutlet]=\"groupHeader.template\"\n        [ngTemplateOutletContext]=\"groupContext\">\n      </ng-template>\n    </div>\n    <ng-content \n      *ngIf=\"(groupHeader && groupHeader.template && expanded) || \n             (!groupHeader || !groupHeader.template)\">\n    </ng-content>\n    <div\n      *ngIf=\"rowDetail && rowDetail.template && expanded\"\n      [style.height.px]=\"detailRowHeight\"\n      class=\"datatable-row-detail\">\n      <ng-template\n        *ngIf=\"rowDetail && rowDetail.template\"\n        [ngTemplateOutlet]=\"rowDetail.template\"\n        [ngTemplateOutletContext]=\"rowContext\">\n      </ng-template>\n    </div>\n  ",
        host: {
            class: 'datatable-row-wrapper'
        }
    })
], DataTableRowWrapperComponent);
exports.DataTableRowWrapperComponent = DataTableRowWrapperComponent;

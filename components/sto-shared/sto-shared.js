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
var common_1 = require("@angular/common");
var shared_1 = require("../../vendor/primeface/components/common/shared");
var StoHeader = (function () {
    function StoHeader() {
    }
    return StoHeader;
}());
StoHeader = __decorate([
    core_1.Component({
        selector: 'sto-header',
        template: '<ng-content></ng-content>'
    })
], StoHeader);
exports.StoHeader = StoHeader;
var StoFooter = (function () {
    function StoFooter() {
    }
    return StoFooter;
}());
StoFooter = __decorate([
    core_1.Component({
        selector: 'sto-footer',
        template: '<ng-content></ng-content>'
    })
], StoFooter);
exports.StoFooter = StoFooter;
var StoTemplate = (function () {
    function StoTemplate(template) {
        this.template = template;
    }
    StoTemplate.prototype.getType = function () {
        return this.name;
    };
    return StoTemplate;
}());
__decorate([
    core_1.Input()
], StoTemplate.prototype, "type", void 0);
__decorate([
    core_1.Input('stoTemplate')
], StoTemplate.prototype, "name", void 0);
StoTemplate = __decorate([
    core_1.Directive({
        selector: '[stoTemplate]',
        host: {}
    })
], StoTemplate);
exports.StoTemplate = StoTemplate;
var StoTemplateWrapper = (function (_super) {
    __extends(StoTemplateWrapper, _super);
    function StoTemplateWrapper(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoTemplateWrapper;
}(shared_1.TemplateWrapper));
__decorate([
    core_1.Input('stoTemplateWrapper')
], StoTemplateWrapper.prototype, "templateRef", void 0);
StoTemplateWrapper = __decorate([
    core_1.Directive({
        selector: '[stoTemplateWrapper]'
    })
], StoTemplateWrapper);
exports.StoTemplateWrapper = StoTemplateWrapper;
var StoColumn = (function (_super) {
    __extends(StoColumn, _super);
    function StoColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoColumn;
}(shared_1.Column));
__decorate([
    core_1.ContentChildren(StoTemplate)
], StoColumn.prototype, "templates", void 0);
StoColumn = __decorate([
    core_1.Component({
        selector: 'sto-column',
        template: ""
    })
], StoColumn);
exports.StoColumn = StoColumn;
var StoRow = (function (_super) {
    __extends(StoRow, _super);
    function StoRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoRow;
}(shared_1.Row));
__decorate([
    core_1.ContentChildren(StoColumn)
], StoRow.prototype, "columns", void 0);
StoRow = __decorate([
    core_1.Component({
        selector: 'sto-row',
        template: ""
    })
], StoRow);
exports.StoRow = StoRow;
var StoHeaderColumnGroup = (function (_super) {
    __extends(StoHeaderColumnGroup, _super);
    function StoHeaderColumnGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoHeaderColumnGroup;
}(shared_1.HeaderColumnGroup));
__decorate([
    core_1.ContentChildren(StoRow)
], StoHeaderColumnGroup.prototype, "rows", void 0);
StoHeaderColumnGroup = __decorate([
    core_1.Component({
        selector: 'sto-headerColumnGroup',
        template: ""
    })
], StoHeaderColumnGroup);
exports.StoHeaderColumnGroup = StoHeaderColumnGroup;
var StoFooterColumnGroup = (function (_super) {
    __extends(StoFooterColumnGroup, _super);
    function StoFooterColumnGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoFooterColumnGroup;
}(shared_1.FooterColumnGroup));
__decorate([
    core_1.ContentChildren(StoRow)
], StoFooterColumnGroup.prototype, "rows", void 0);
StoFooterColumnGroup = __decorate([
    core_1.Component({
        selector: 'sto-footerColumnGroup',
        template: ""
    })
], StoFooterColumnGroup);
exports.StoFooterColumnGroup = StoFooterColumnGroup;
var StoColumnBodyTemplateLoader = (function (_super) {
    __extends(StoColumnBodyTemplateLoader, _super);
    function StoColumnBodyTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoColumnBodyTemplateLoader;
}(shared_1.ColumnBodyTemplateLoader));
StoColumnBodyTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-columnBodyTemplateLoader',
        template: ""
    })
], StoColumnBodyTemplateLoader);
exports.StoColumnBodyTemplateLoader = StoColumnBodyTemplateLoader;
var StoColumnHeaderTemplateLoader = (function (_super) {
    __extends(StoColumnHeaderTemplateLoader, _super);
    function StoColumnHeaderTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoColumnHeaderTemplateLoader;
}(shared_1.ColumnHeaderTemplateLoader));
StoColumnHeaderTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-columnHeaderTemplateLoader',
        template: ""
    })
], StoColumnHeaderTemplateLoader);
exports.StoColumnHeaderTemplateLoader = StoColumnHeaderTemplateLoader;
var StoColumnFooterTemplateLoader = (function (_super) {
    __extends(StoColumnFooterTemplateLoader, _super);
    function StoColumnFooterTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoColumnFooterTemplateLoader;
}(shared_1.ColumnFooterTemplateLoader));
StoColumnFooterTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-columnFooterTemplateLoader',
        template: ""
    })
], StoColumnFooterTemplateLoader);
exports.StoColumnFooterTemplateLoader = StoColumnFooterTemplateLoader;
var StoColumnFilterTemplateLoader = (function (_super) {
    __extends(StoColumnFilterTemplateLoader, _super);
    function StoColumnFilterTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoColumnFilterTemplateLoader;
}(shared_1.ColumnFilterTemplateLoader));
StoColumnFilterTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-columnFilterTemplateLoader',
        template: ""
    })
], StoColumnFilterTemplateLoader);
exports.StoColumnFilterTemplateLoader = StoColumnFilterTemplateLoader;
var StoColumnEditorTemplateLoader = (function (_super) {
    __extends(StoColumnEditorTemplateLoader, _super);
    function StoColumnEditorTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoColumnEditorTemplateLoader;
}(shared_1.ColumnEditorTemplateLoader));
StoColumnEditorTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-columnEditorTemplateLoader',
        template: ""
    })
], StoColumnEditorTemplateLoader);
exports.StoColumnEditorTemplateLoader = StoColumnEditorTemplateLoader;
var StoTemplateLoader = (function (_super) {
    __extends(StoTemplateLoader, _super);
    function StoTemplateLoader(viewContainer) {
        var _this = _super.call(this, viewContainer) || this;
        _this.viewContainer = viewContainer;
        return _this;
    }
    return StoTemplateLoader;
}(shared_1.TemplateLoader));
StoTemplateLoader = __decorate([
    core_1.Component({
        selector: 'sto-templateLoader',
        template: ""
    })
], StoTemplateLoader);
exports.StoTemplateLoader = StoTemplateLoader;
var StoSharedModule = (function () {
    function StoSharedModule() {
    }
    return StoSharedModule;
}());
StoSharedModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoHeader, StoFooter, StoColumn, StoTemplateWrapper, StoColumnHeaderTemplateLoader, StoColumnBodyTemplateLoader, StoColumnFooterTemplateLoader, StoColumnFilterTemplateLoader, StoTemplate, StoTemplateLoader, StoRow, StoHeaderColumnGroup, StoFooterColumnGroup, StoColumnEditorTemplateLoader],
        declarations: [StoHeader, StoFooter, StoColumn, StoTemplateWrapper, StoColumnHeaderTemplateLoader, StoColumnBodyTemplateLoader, StoColumnFooterTemplateLoader, StoColumnFilterTemplateLoader, StoTemplate, StoTemplateLoader, StoRow, StoHeaderColumnGroup, StoFooterColumnGroup, StoColumnEditorTemplateLoader],
    })
], StoSharedModule);
exports.StoSharedModule = StoSharedModule;

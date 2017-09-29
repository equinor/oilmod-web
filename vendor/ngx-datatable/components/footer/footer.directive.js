"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var footer_template_directive_1 = require("./footer-template.directive");
var DatatableFooterDirective = (function () {
    function DatatableFooterDirective() {
    }
    return DatatableFooterDirective;
}());
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "footerHeight", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "totalMessage", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "selectedMessage", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "pagerLeftArrowIcon", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "pagerRightArrowIcon", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "pagerPreviousIcon", void 0);
__decorate([
    core_1.Input()
], DatatableFooterDirective.prototype, "pagerNextIcon", void 0);
__decorate([
    core_1.Input(),
    core_1.ContentChild(footer_template_directive_1.DataTableFooterTemplateDirective, { read: core_1.TemplateRef })
], DatatableFooterDirective.prototype, "template", void 0);
DatatableFooterDirective = __decorate([
    core_1.Directive({ selector: 'ngx-datatable-footer' })
], DatatableFooterDirective);
exports.DatatableFooterDirective = DatatableFooterDirective;

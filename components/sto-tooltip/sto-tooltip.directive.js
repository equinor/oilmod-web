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
var common_1 = require("@angular/common");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var core_1 = require("@angular/core");
var tooltip_1 = require("../../vendor/primeface/components/tooltip/tooltip");
var StoTooltipDirective = (function (_super) {
    __extends(StoTooltipDirective, _super);
    function StoTooltipDirective(el, domHandler) {
        var _this = _super.call(this, el, domHandler) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        return _this;
    }
    return StoTooltipDirective;
}(tooltip_1.Tooltip));
__decorate([
    core_1.Input('stoTooltip')
], StoTooltipDirective.prototype, "text", void 0);
StoTooltipDirective = __decorate([
    core_1.Directive({
        selector: '[stoTooltip]',
        host: {},
        providers: [domhandler_1.DomHandler]
    })
], StoTooltipDirective);
exports.StoTooltipDirective = StoTooltipDirective;
var StoTooltipModule = (function () {
    function StoTooltipModule() {
    }
    return StoTooltipModule;
}());
StoTooltipModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoTooltipDirective],
        declarations: [StoTooltipDirective]
    })
], StoTooltipModule);
exports.StoTooltipModule = StoTooltipModule;

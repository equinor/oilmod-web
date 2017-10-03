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
var button_1 = require("../../vendor/primeface/components/button/button");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var common_1 = require("@angular/common");
var StoButtonDirective = (function (_super) {
    __extends(StoButtonDirective, _super);
    function StoButtonDirective(el, domHandler) {
        var _this = _super.call(this, el, domHandler) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        return _this;
    }
    return StoButtonDirective;
}(button_1.Button));
StoButtonDirective = __decorate([
    core_1.Directive({
        selector: '[stoButton]',
        providers: [domhandler_1.DomHandler]
    })
], StoButtonDirective);
exports.StoButtonDirective = StoButtonDirective;
var StoButtonModule = (function () {
    function StoButtonModule() {
    }
    return StoButtonModule;
}());
StoButtonModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoButtonDirective],
        declarations: [StoButtonDirective]
    })
], StoButtonModule);
exports.StoButtonModule = StoButtonModule;

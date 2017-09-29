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
var inputtextarea_1 = require("../../vendor/primeface/components/inputtextarea/inputtextarea");
var StoInputTextareaDirective = (function (_super) {
    __extends(StoInputTextareaDirective, _super);
    function StoInputTextareaDirective(el) {
        var _this = _super.call(this, el) || this;
        _this.el = el;
        return _this;
    }
    return StoInputTextareaDirective;
}(inputtextarea_1.InputTextarea));
StoInputTextareaDirective = __decorate([
    core_1.Directive({
        selector: '[stoInputTextarea]',
        host: {
            '[class.ui-inputtext]': 'true',
            '[class.ui-corner-all]': 'true',
            '[class.ui-state-default]': 'true',
            '[class.ui-widget]': 'true',
            '[class.ui-state-filled]': 'filled',
            '[attr.rows]': 'rows',
            '[attr.cols]': 'cols'
        }
    })
], StoInputTextareaDirective);
exports.StoInputTextareaDirective = StoInputTextareaDirective;
var StoInputTextareaModule = (function () {
    function StoInputTextareaModule() {
    }
    return StoInputTextareaModule;
}());
StoInputTextareaModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoInputTextareaDirective],
        declarations: [StoInputTextareaDirective]
    })
], StoInputTextareaModule);
exports.StoInputTextareaModule = StoInputTextareaModule;

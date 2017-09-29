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
var CustomDecorator_1 = require("./CustomDecorator");
var common_1 = require("@angular/common");
var observers_1 = require("@angular/cdk/observers");
var core_2 = require("@angular/material/core");
var a11y_1 = require("@angular/cdk/a11y");
var a11y_2 = require("@angular/cdk/a11y");
var checkbox_1 = require("@angular/material/checkbox");
var StoCheckboxComponentMD = (function (_super) {
    __extends(StoCheckboxComponentMD, _super);
    function StoCheckboxComponentMD(renderer, elementRef, changeDetectorRef, focusMonitor) {
        return _super.call(this, renderer, elementRef, changeDetectorRef, focusMonitor) || this;
    }
    return StoCheckboxComponentMD;
}(checkbox_1.MdCheckbox));
StoCheckboxComponentMD = __decorate([
    CustomDecorator_1.CustomComponent({
        selector: 'si-checkbox-md',
        providers: [core_1.Renderer2, core_1.ChangeDetectorRef, a11y_2.FocusMonitor]
    })
], StoCheckboxComponentMD);
exports.StoCheckboxComponentMD = StoCheckboxComponentMD;
var StoCheckboxModule2 = (function () {
    function StoCheckboxModule2() {
    }
    return StoCheckboxModule2;
}());
StoCheckboxModule2 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, core_2.MdRippleModule, core_2.MdCommonModule, observers_1.ObserversModule, a11y_1.A11yModule],
        exports: [StoCheckboxComponentMD],
        declarations: [StoCheckboxComponentMD],
        providers: [checkbox_1.MdCheckbox]
    })
], StoCheckboxModule2);
exports.StoCheckboxModule2 = StoCheckboxModule2;

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
var forms_1 = require("@angular/forms");
var slider_1 = require("../../vendor/primeface/components/slider/slider");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
exports.SLIDER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoSliderComponent; }),
    multi: true
};
var StoSliderComponent = (function (_super) {
    __extends(StoSliderComponent, _super);
    function StoSliderComponent(el, domHandler, renderer) {
        var _this = _super.call(this, el, domHandler, renderer) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        return _this;
    }
    return StoSliderComponent;
}(slider_1.Slider));
StoSliderComponent = __decorate([
    core_1.Component({
        selector: 'sto-slider',
        templateUrl: 'sto-slider.component.html',
        styleUrls: ['sto-slider.component.scss'],
        providers: [exports.SLIDER_VALUE_ACCESSOR, domhandler_1.DomHandler]
    })
], StoSliderComponent);
exports.StoSliderComponent = StoSliderComponent;
var StoSliderModule = (function () {
    function StoSliderModule() {
    }
    return StoSliderModule;
}());
StoSliderModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoSliderComponent],
        declarations: [StoSliderComponent]
    })
], StoSliderModule);
exports.StoSliderModule = StoSliderModule;

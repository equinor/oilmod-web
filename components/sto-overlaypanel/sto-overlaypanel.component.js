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
// OverlayPanelModule
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var overlaypanel_1 = require("../../vendor/primeface/components/overlaypanel/overlaypanel");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var StoOverlayPanelComponent = (function (_super) {
    __extends(StoOverlayPanelComponent, _super);
    function StoOverlayPanelComponent(el, domHandler, renderer) {
        var _this = _super.call(this, el, domHandler, renderer) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        return _this;
    }
    return StoOverlayPanelComponent;
}(overlaypanel_1.OverlayPanel));
StoOverlayPanelComponent = __decorate([
    core_1.Component({
        selector: 'sto-overlaypanel',
        templateUrl: 'sto-overlaypanel.component.html',
        styleUrls: ['sto-overlaypanel.component.scss'],
        providers: [domhandler_1.DomHandler]
    })
], StoOverlayPanelComponent);
exports.StoOverlayPanelComponent = StoOverlayPanelComponent;
var StoOverlayPanelModule = (function () {
    function StoOverlayPanelModule() {
    }
    return StoOverlayPanelModule;
}());
StoOverlayPanelModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoOverlayPanelComponent],
        declarations: [StoOverlayPanelComponent]
    })
], StoOverlayPanelModule);
exports.StoOverlayPanelModule = StoOverlayPanelModule;

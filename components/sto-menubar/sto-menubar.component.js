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
var router_1 = require("@angular/router");
var menubar_1 = require("../../vendor/primeface/components/menubar/menubar");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var sto_menubar_sub_component_1 = require("./sto-menubar-sto/sto-menubar-sub.component");
var StoMenubarComponent = (function (_super) {
    __extends(StoMenubarComponent, _super);
    function StoMenubarComponent(el, domHandler, renderer) {
        var _this = _super.call(this, el, domHandler, renderer) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        return _this;
    }
    return StoMenubarComponent;
}(menubar_1.Menubar));
StoMenubarComponent = __decorate([
    core_1.Component({
        selector: 'sto-menubar',
        templateUrl: 'sto-menubar.component.html',
        styleUrls: ['sto-menubar.component.scss'],
        encapsulation: core_1.ViewEncapsulation.None,
        providers: [domhandler_1.DomHandler]
    })
], StoMenubarComponent);
exports.StoMenubarComponent = StoMenubarComponent;
var StoMenubarModule = (function () {
    function StoMenubarModule() {
    }
    return StoMenubarModule;
}());
StoMenubarModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, router_1.RouterModule],
        exports: [StoMenubarComponent, sto_menubar_sub_component_1.StoMenubarSubComponent, router_1.RouterModule],
        declarations: [StoMenubarComponent, sto_menubar_sub_component_1.StoMenubarSubComponent]
    })
], StoMenubarModule);
exports.StoMenubarModule = StoMenubarModule;

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
var tabview_1 = require("../../vendor/primeface/components/tabview/tabview");
var sto_tabview_nav_component_1 = require("./sto-tabview-nav/sto-tabview-nav.component");
var sto_tabpanel_component_1 = require("./sto-tabpanel/sto-tabpanel.component");
var StoTabView = (function (_super) {
    __extends(StoTabView, _super);
    function StoTabView(el) {
        var _this = _super.call(this, el) || this;
        _this.el = el;
        return _this;
    }
    return StoTabView;
}(tabview_1.TabView));
__decorate([
    core_1.ContentChildren(sto_tabpanel_component_1.StoTabPanel)
], StoTabView.prototype, "tabPanels", void 0);
StoTabView = __decorate([
    core_1.Component({
        selector: 'sto-tabView',
        styleUrls: ['sto-tabview.component.scss'],
        templateUrl: 'sto-tabview.component.html',
        encapsulation: core_1.ViewEncapsulation.None
    })
], StoTabView);
exports.StoTabView = StoTabView;
var StoTabViewModule = (function () {
    function StoTabViewModule() {
    }
    return StoTabViewModule;
}());
StoTabViewModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoTabView, sto_tabpanel_component_1.StoTabPanel, sto_tabview_nav_component_1.StoTabViewNav],
        declarations: [StoTabView, sto_tabpanel_component_1.StoTabPanel, sto_tabview_nav_component_1.StoTabViewNav]
    })
], StoTabViewModule);
exports.StoTabViewModule = StoTabViewModule;

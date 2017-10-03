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
var splitbutton_1 = require("../../vendor/primeface/components/splitbutton/splitbutton");
var router_1 = require("@angular/router");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var common_1 = require("@angular/common");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var StoSplitbuttonComponent = (function (_super) {
    __extends(StoSplitbuttonComponent, _super);
    function StoSplitbuttonComponent(el, domHandler, renderer, router, cd) {
        var _this = _super.call(this, el, domHandler, renderer, router, cd) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.router = router;
        _this.cd = cd;
        _this.dropDown = true;
        return _this;
    }
    StoSplitbuttonComponent.prototype.onDefaultButtonClick = function (event, menu, container) {
        if (!this.dropDown) {
            this.onClick.emit(event);
        }
        else {
            event.preventDefault();
            this.onDropdownClick(event, menu, container);
        }
    };
    return StoSplitbuttonComponent;
}(splitbutton_1.SplitButton));
__decorate([
    core_1.Input()
], StoSplitbuttonComponent.prototype, "dropDown", void 0);
StoSplitbuttonComponent = __decorate([
    core_1.Component({
        selector: 'sto-splitButton',
        templateUrl: './sto-splitbutton.component.html',
        styleUrls: ['./sto-splitbutton.component.scss'],
        providers: [domhandler_1.DomHandler]
    })
], StoSplitbuttonComponent);
exports.StoSplitbuttonComponent = StoSplitbuttonComponent;
var StoSplitbuttonModule = (function () {
    function StoSplitbuttonModule() {
    }
    return StoSplitbuttonModule;
}());
StoSplitbuttonModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, router_1.RouterModule, sto_button_directive_1.StoButtonModule],
        exports: [StoSplitbuttonComponent],
        declarations: [StoSplitbuttonComponent]
    })
], StoSplitbuttonModule);
exports.StoSplitbuttonModule = StoSplitbuttonModule;

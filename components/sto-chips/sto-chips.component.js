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
var sto_shared_1 = require("../sto-shared/sto-shared");
var sto_inputtext_directive_1 = require("../sto-inputtext/sto-inputtext.directive");
var chips_1 = require("../../vendor/primeface/components/chips/chips");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
exports.CHIPS_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoChipsComponent; }),
    multi: true
};
var StoChipsComponent = (function (_super) {
    __extends(StoChipsComponent, _super);
    function StoChipsComponent(el, domHandler) {
        var _this = _super.call(this, el, domHandler) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        return _this;
    }
    return StoChipsComponent;
}(chips_1.Chips));
__decorate([
    core_1.ContentChildren(sto_shared_1.StoTemplate)
], StoChipsComponent.prototype, "templates", void 0);
StoChipsComponent = __decorate([
    core_1.Component({
        selector: 'sto-chips',
        templateUrl: 'sto-chips.component.html',
        styleUrls: ['sto-chips.component.scss'],
        providers: [domhandler_1.DomHandler, exports.CHIPS_VALUE_ACCESSOR]
    })
], StoChipsComponent);
exports.StoChipsComponent = StoChipsComponent;
var StoChipsModule = (function () {
    function StoChipsModule() {
    }
    return StoChipsModule;
}());
StoChipsModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_inputtext_directive_1.StoInputTextModule, sto_shared_1.StoSharedModule],
        exports: [StoChipsComponent, sto_inputtext_directive_1.StoInputTextModule, sto_shared_1.StoSharedModule],
        declarations: [StoChipsComponent]
    })
], StoChipsModule);
exports.StoChipsModule = StoChipsModule;

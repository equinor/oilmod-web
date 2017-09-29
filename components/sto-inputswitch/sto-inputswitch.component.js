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
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var inputswitch_1 = require("../../vendor/primeface/components/inputswitch/inputswitch");
exports.INPUTSWITCH_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoInputSwitchComponent; }),
    multi: true
};
var StoInputSwitchComponent = (function (_super) {
    __extends(StoInputSwitchComponent, _super);
    function StoInputSwitchComponent(el, domHandler) {
        var _this = _super.call(this, el, domHandler) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        return _this;
    }
    return StoInputSwitchComponent;
}(inputswitch_1.InputSwitch));
StoInputSwitchComponent = __decorate([
    core_1.Component({
        selector: 'sto-inputSwitch',
        templateUrl: 'sto-inputswitch.component.html',
        styleUrls: ['sto-inputswitch.component.scss'],
        providers: [exports.INPUTSWITCH_VALUE_ACCESSOR, domhandler_1.DomHandler]
    })
], StoInputSwitchComponent);
exports.StoInputSwitchComponent = StoInputSwitchComponent;
var StoInputSwitchModule = (function () {
    function StoInputSwitchModule() {
    }
    return StoInputSwitchModule;
}());
StoInputSwitchModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoInputSwitchComponent],
        declarations: [StoInputSwitchComponent]
    })
], StoInputSwitchModule);
exports.StoInputSwitchModule = StoInputSwitchModule;

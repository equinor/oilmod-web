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
var spinner_1 = require("../../vendor/primeface/components/spinner/spinner");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var sto_inputtext_directive_1 = require("../sto-inputtext/sto-inputtext.directive");
exports.SPINNER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoSpinnerComponent; }),
    multi: true
};
var StoSpinnerComponent = (function (_super) {
    __extends(StoSpinnerComponent, _super);
    function StoSpinnerComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoSpinnerComponent;
}(spinner_1.Spinner));
StoSpinnerComponent = __decorate([
    core_1.Component({
        selector: 'sto-spinner',
        templateUrl: 'sto-spinner.component.html',
        styleUrls: ['sto.spinner.component.scss'],
        host: {
            '[class.ui-inputwrapper-filled]': 'filled',
            '[class.ui-inputwrapper-focus]': 'focus'
        },
        providers: [domhandler_1.DomHandler, exports.SPINNER_VALUE_ACCESSOR],
    })
], StoSpinnerComponent);
exports.StoSpinnerComponent = StoSpinnerComponent;
var StoSpinnerModule = (function () {
    function StoSpinnerModule() {
    }
    return StoSpinnerModule;
}());
StoSpinnerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_inputtext_directive_1.StoInputTextModule],
        exports: [StoSpinnerComponent],
        declarations: [StoSpinnerComponent]
    })
], StoSpinnerModule);
exports.StoSpinnerModule = StoSpinnerModule;

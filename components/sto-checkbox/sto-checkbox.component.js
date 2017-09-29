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
var checkbox_1 = require("../../vendor/primeface/components/checkbox/checkbox");
exports.CHECKBOX_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoCheckboxComponent; }),
    multi: true
};
var StoCheckboxComponent = (function (_super) {
    __extends(StoCheckboxComponent, _super);
    function StoCheckboxComponent(cd) {
        var _this = _super.call(this, cd) || this;
        _this.cd = cd;
        return _this;
    }
    return StoCheckboxComponent;
}(checkbox_1.Checkbox));
StoCheckboxComponent = __decorate([
    core_1.Component({
        selector: 'sto-checkbox',
        styleUrls: ['sto-checkbox.component.scss'],
        templateUrl: 'sto-checkbox.component.html',
        encapsulation: core_1.ViewEncapsulation.None,
        providers: [exports.CHECKBOX_VALUE_ACCESSOR]
    })
], StoCheckboxComponent);
exports.StoCheckboxComponent = StoCheckboxComponent;
var StoCheckboxModule = (function () {
    function StoCheckboxModule() {
    }
    return StoCheckboxModule;
}());
StoCheckboxModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoCheckboxComponent],
        declarations: [StoCheckboxComponent]
    })
], StoCheckboxModule);
exports.StoCheckboxModule = StoCheckboxModule;

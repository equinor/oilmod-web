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
var animations_1 = require("@angular/animations");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var dropdown_1 = require("../../vendor/primeface/components/dropdown/dropdown");
var sto_shared_1 = require("../sto-shared/sto-shared");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var ObjectUtils_1 = require("../../vendor/primeface/components/utils/ObjectUtils");
exports.DROPDOWN_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoDropdownComponent; }),
    multi: true
};
var StoDropdownComponent = (function (_super) {
    __extends(StoDropdownComponent, _super);
    function StoDropdownComponent(el, domHandler, renderer, cd, objectUtils) {
        var _this = _super.call(this, el, domHandler, renderer, cd, objectUtils) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.cd = cd;
        _this.objectUtils = objectUtils;
        return _this;
    }
    return StoDropdownComponent;
}(dropdown_1.Dropdown));
__decorate([
    core_1.ContentChildren(sto_shared_1.StoTemplate)
], StoDropdownComponent.prototype, "templates", void 0);
StoDropdownComponent = __decorate([
    core_1.Component({
        selector: 'sto-dropdown',
        templateUrl: 'sto-dropdown.component.html',
        styleUrls: ['sto-dropdown.component.scss'],
        animations: [
            animations_1.trigger('panelState', [
                animations_1.state('hidden', animations_1.style({
                    opacity: 0
                })),
                animations_1.state('visible', animations_1.style({
                    opacity: 1
                })),
            ])
        ],
        providers: [domhandler_1.DomHandler, ObjectUtils_1.ObjectUtils, exports.DROPDOWN_VALUE_ACCESSOR]
    })
], StoDropdownComponent);
exports.StoDropdownComponent = StoDropdownComponent;
var StoDropdownModule = (function () {
    function StoDropdownModule() {
    }
    return StoDropdownModule;
}());
StoDropdownModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_shared_1.StoSharedModule],
        exports: [StoDropdownComponent, sto_shared_1.StoSharedModule],
        declarations: [StoDropdownComponent]
    })
], StoDropdownModule);
exports.StoDropdownModule = StoDropdownModule;

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
var autocomplete_1 = require("../../vendor/primeface/components/autocomplete/autocomplete");
var sto_shared_1 = require("../sto-shared/sto-shared");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var ObjectUtils_1 = require("../../vendor/primeface/components/utils/ObjectUtils");
var sto_inputtext_directive_1 = require("../sto-inputtext/sto-inputtext.directive");
var sto_growl_component_1 = require("../sto-growl/sto-growl.component");
exports.AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoAutoCompleteComponent; }),
    multi: true
};
var StoAutoCompleteComponent = (function (_super) {
    __extends(StoAutoCompleteComponent, _super);
    function StoAutoCompleteComponent(el, domHandler, renderer, objectUtils, cd) {
        var _this = _super.call(this, el, domHandler, renderer, objectUtils, cd) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.objectUtils = objectUtils;
        _this.cd = cd;
        return _this;
    }
    return StoAutoCompleteComponent;
}(autocomplete_1.AutoComplete));
__decorate([
    core_1.ContentChildren(sto_shared_1.StoTemplate)
], StoAutoCompleteComponent.prototype, "templates", void 0);
StoAutoCompleteComponent = __decorate([
    core_1.Component({
        selector: 'sto-autoComplete',
        templateUrl: 'sto-autocomplete.component.html',
        host: {
            '[class.ui-inputwrapper-filled]': 'filled',
            '[class.ui-inputwrapper-focus]': 'focus'
        },
        providers: [domhandler_1.DomHandler, ObjectUtils_1.ObjectUtils, exports.AUTOCOMPLETE_VALUE_ACCESSOR]
    })
], StoAutoCompleteComponent);
exports.StoAutoCompleteComponent = StoAutoCompleteComponent;
var StoAutoCompleteModule = (function () {
    function StoAutoCompleteModule() {
    }
    return StoAutoCompleteModule;
}());
StoAutoCompleteModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_growl_component_1.StoGrowlModule, sto_inputtext_directive_1.StoInputTextModule, sto_button_directive_1.StoButtonModule, sto_shared_1.StoSharedModule],
        exports: [StoAutoCompleteComponent],
        declarations: [StoAutoCompleteComponent]
    })
], StoAutoCompleteModule);
exports.StoAutoCompleteModule = StoAutoCompleteModule;

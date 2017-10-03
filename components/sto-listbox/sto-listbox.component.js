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
var ObjectUtils_1 = require("../../vendor/primeface/components/utils/ObjectUtils");
var listbox_1 = require("../../vendor/primeface/components/listbox/listbox");
var sto_shared_1 = require("../sto-shared/sto-shared");
exports.LISTBOX_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoListboxComponent; }),
    multi: true
};
var StoListboxComponent = (function (_super) {
    __extends(StoListboxComponent, _super);
    function StoListboxComponent(el, domHandler, objectUtils) {
        var _this = _super.call(this, el, domHandler, objectUtils) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.objectUtils = objectUtils;
        return _this;
    }
    return StoListboxComponent;
}(listbox_1.Listbox));
__decorate([
    core_1.ContentChildren(sto_shared_1.StoTemplate)
], StoListboxComponent.prototype, "templates", void 0);
StoListboxComponent = __decorate([
    core_1.Component({
        selector: 'sto-listbox',
        templateUrl: 'sto-listbox.component.html',
        styleUrls: ['sto-listbox.component.scss'],
        providers: [domhandler_1.DomHandler, ObjectUtils_1.ObjectUtils, exports.LISTBOX_VALUE_ACCESSOR]
    })
], StoListboxComponent);
exports.StoListboxComponent = StoListboxComponent;
var StoListboxModule = (function () {
    function StoListboxModule() {
    }
    return StoListboxModule;
}());
StoListboxModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_shared_1.StoSharedModule],
        exports: [StoListboxComponent, sto_shared_1.StoSharedModule],
        declarations: [StoListboxComponent]
    })
], StoListboxModule);
exports.StoListboxModule = StoListboxModule;

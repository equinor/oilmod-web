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
var multiselect_1 = require("../../vendor/primeface/components/multiselect/multiselect");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var ObjectUtils_1 = require("../../vendor/primeface/components/utils/ObjectUtils");
exports.MULTISELECT_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoMultiSelectComponent; }),
    multi: true
};
var StoMultiSelectComponent = (function (_super) {
    __extends(StoMultiSelectComponent, _super);
    function StoMultiSelectComponent(el, domHandler, renderer, differs, objectUtils) {
        var _this = _super.call(this, el, domHandler, renderer, differs, objectUtils) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.objectUtils = objectUtils;
        return _this;
    }
    StoMultiSelectComponent.prototype.findLabelByValue = function (val) {
        var label = null;
        if (!this.dataKey) {
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.value == val) {
                    label = option.label;
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.value[this.dataKey] == val[this.dataKey]) {
                    label = option.label;
                    break;
                }
            }
        }
        return label;
    };
    return StoMultiSelectComponent;
}(multiselect_1.MultiSelect));
StoMultiSelectComponent = __decorate([
    core_1.Component({
        selector: 'sto-multiSelect',
        templateUrl: 'sto-multiselect.component.html',
        styleUrls: ['sto-multiselect.component.scss'],
        providers: [domhandler_1.DomHandler, ObjectUtils_1.ObjectUtils, exports.MULTISELECT_VALUE_ACCESSOR]
    })
], StoMultiSelectComponent);
exports.StoMultiSelectComponent = StoMultiSelectComponent;
var StoMultiSelectModule = (function () {
    function StoMultiSelectModule() {
    }
    return StoMultiSelectModule;
}());
StoMultiSelectModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoMultiSelectComponent],
        declarations: [StoMultiSelectComponent]
    })
], StoMultiSelectModule);
exports.StoMultiSelectModule = StoMultiSelectModule;

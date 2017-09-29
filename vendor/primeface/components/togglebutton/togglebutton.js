"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
exports.TOGGLEBUTTON_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return ToggleButton; }),
    multi: true
};
var ToggleButton = (function () {
    function ToggleButton() {
        this.onLabel = 'Yes';
        this.offLabel = 'No';
        this.onChange = new core_1.EventEmitter();
        this.checked = false;
        this.focus = false;
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    ToggleButton.prototype.ngAfterViewInit = function () {
        this.checkbox = this.checkboxViewChild.nativeElement;
    };
    ToggleButton.prototype.getIconClass = function () {
        var baseClass = 'ui-button-icon-left fa fa-fw';
        return baseClass + ' ' + (this.checked ? this.onIcon : this.offIcon);
    };
    ToggleButton.prototype.toggle = function (event) {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            this.checkbox.focus();
        }
    };
    ToggleButton.prototype.onFocus = function () {
        this.focus = true;
    };
    ToggleButton.prototype.onBlur = function () {
        this.focus = false;
        this.onModelTouched();
    };
    ToggleButton.prototype.writeValue = function (value) {
        this.checked = value;
    };
    ToggleButton.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    ToggleButton.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    ToggleButton.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    return ToggleButton;
}());
__decorate([
    core_1.Input()
], ToggleButton.prototype, "onLabel", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "offLabel", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "onIcon", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "offIcon", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "style", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "inputId", void 0);
__decorate([
    core_1.Input()
], ToggleButton.prototype, "tabindex", void 0);
__decorate([
    core_1.Output()
], ToggleButton.prototype, "onChange", void 0);
__decorate([
    core_1.ViewChild('checkbox')
], ToggleButton.prototype, "checkboxViewChild", void 0);
exports.ToggleButton = ToggleButton;
var ToggleButtonModule = (function () {
    function ToggleButtonModule() {
    }
    return ToggleButtonModule;
}());
exports.ToggleButtonModule = ToggleButtonModule;

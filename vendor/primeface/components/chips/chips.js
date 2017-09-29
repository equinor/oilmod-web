"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var shared_1 = require("../common/shared");
var forms_1 = require("@angular/forms");
exports.CHIPS_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return Chips; }),
    multi: true
};
var Chips = (function () {
    function Chips(el, domHandler) {
        this.el = el;
        this.domHandler = domHandler;
        this.onAdd = new core_1.EventEmitter();
        this.onRemove = new core_1.EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    Chips.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'item':
                    _this.itemTemplate = item.template;
                    break;
                default:
                    _this.itemTemplate = item.template;
                    break;
            }
        });
    };
    Chips.prototype.writeValue = function (value) {
        this.value = value;
    };
    Chips.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    Chips.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    Chips.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    Chips.prototype.resolveFieldData = function (data, field) {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                var fields = field.split('.');
                var value = data;
                for (var i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    };
    Chips.prototype.onFocus = function () {
        this.focus = true;
    };
    Chips.prototype.onBlur = function () {
        this.focus = false;
        this.onModelTouched();
    };
    Chips.prototype.removeItem = function (event, index) {
        if (this.disabled) {
            return;
        }
        var removedItem = this.value[index];
        this.value = this.value.filter(function (val, i) { return i != index; });
        this.onModelChange(this.value);
        this.onRemove.emit({
            originalEvent: event,
            value: removedItem
        });
    };
    Chips.prototype.onKeydown = function (event, inputEL) {
        switch (event.which) {
            //backspace
            case 8:
                if (inputEL.value.length === 0 && this.value && this.value.length > 0) {
                    this.value = this.value.slice();
                    var removedItem = this.value.pop();
                    this.onModelChange(this.value);
                    this.onRemove.emit({
                        originalEvent: event,
                        value: removedItem
                    });
                }
                break;
            //enter
            case 13:
                this.value = this.value || [];
                if (inputEL.value && inputEL.value.trim().length && (!this.max || this.max > this.value.length)) {
                    this.value = this.value.concat([inputEL.value]);
                    this.onModelChange(this.value);
                    this.onAdd.emit({
                        originalEvent: event,
                        value: inputEL.value
                    });
                }
                inputEL.value = '';
                event.preventDefault();
                break;
            default:
                if (this.max && this.value && this.max === this.value.length) {
                    event.preventDefault();
                }
                break;
        }
    };
    Object.defineProperty(Chips.prototype, "maxedOut", {
        get: function () {
            return this.max && this.value && this.max === this.value.length;
        },
        enumerable: true,
        configurable: true
    });
    return Chips;
}());
__decorate([
    core_1.Input()
], Chips.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "disabled", void 0);
__decorate([
    core_1.Output()
], Chips.prototype, "onAdd", void 0);
__decorate([
    core_1.Output()
], Chips.prototype, "onRemove", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "field", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "placeholder", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "max", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "tabindex", void 0);
__decorate([
    core_1.Input()
], Chips.prototype, "inputId", void 0);
__decorate([
    core_1.ContentChildren(shared_1.PrimeTemplate)
], Chips.prototype, "templates", void 0);
exports.Chips = Chips;
var ChipsModule = (function () {
    function ChipsModule() {
    }
    return ChipsModule;
}());
exports.ChipsModule = ChipsModule;

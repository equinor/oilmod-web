"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../dom/domhandler");
var Growl = (function () {
    function Growl(el, domHandler) {
        this.el = el;
        this.domHandler = domHandler;
        this.sticky = false;
        this.life = 3000;
        this.valueChange = new core_1.EventEmitter();
        this.zIndex = domhandler_1.DomHandler.zindex;
    }
    Growl.prototype.ngAfterViewInit = function () {
        this.container = this.containerViewChild.nativeElement;
    };
    Object.defineProperty(Growl.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
            if (this.container) {
                this.handleValueChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Growl.prototype.handleValueChange = function () {
        var _this = this;
        this.zIndex = ++domhandler_1.DomHandler.zindex;
        this.domHandler.fadeIn(this.container, 250);
        if (!this.sticky) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(function () {
                _this.removeAll();
            }, this.life);
        }
    };
    Growl.prototype.remove = function (index, msgel) {
        var _this = this;
        this.domHandler.fadeOut(msgel, 250);
        setTimeout(function () {
            _this.value = _this.value.filter(function (val, i) { return i != index; });
            _this.valueChange.emit(_this.value);
        }, 250);
    };
    Growl.prototype.removeAll = function () {
        var _this = this;
        if (this.value && this.value.length) {
            this.domHandler.fadeOut(this.container, 250);
            setTimeout(function () {
                _this.value = [];
                _this.valueChange.emit(_this.value);
            }, 250);
        }
    };
    Growl.prototype.ngOnDestroy = function () {
        if (!this.sticky) {
            clearTimeout(this.timeout);
        }
    };
    return Growl;
}());
__decorate([
    core_1.Input()
], Growl.prototype, "sticky", void 0);
__decorate([
    core_1.Input()
], Growl.prototype, "life", void 0);
__decorate([
    core_1.Input()
], Growl.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Growl.prototype, "styleClass", void 0);
__decorate([
    core_1.Output()
], Growl.prototype, "valueChange", void 0);
__decorate([
    core_1.ViewChild('container')
], Growl.prototype, "containerViewChild", void 0);
__decorate([
    core_1.Input()
], Growl.prototype, "value", null);
exports.Growl = Growl;
var GrowlModule = (function () {
    function GrowlModule() {
    }
    return GrowlModule;
}());
exports.GrowlModule = GrowlModule;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var animations_1 = require("@angular/animations");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var StoDrawerComponent = (function () {
    function StoDrawerComponent(renderer) {
        this.renderer = renderer;
        this.width = '25vw';
        this.padding = '0px';
        this.onToggle = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        this.onOpen = new core_1.EventEmitter();
        this.style = (_a = {},
            _a[this.position] = this.open ? 0 : "-" + this.width,
            _a);
        var _a;
    }
    Object.defineProperty(StoDrawerComponent.prototype, "open", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            var _this = this;
            this._open = open;
            if (this.closeOnClick) {
                setTimeout(function () {
                    if (open) {
                        _this.bindDocumentClickListener();
                    }
                    else if (_this.documentClickListener) {
                        _this.documentClickListener();
                        _this.documentClickListener = null;
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    StoDrawerComponent.prototype.toggle = function (emit) {
        if (emit === void 0) { emit = true; }
        if (emit) {
            this.onToggle.emit(!this.open);
        }
        if (!this.open) {
            this.openDrawer(emit);
        }
        else {
            this.closeDrawer(emit);
        }
    };
    StoDrawerComponent.prototype.closeDrawer = function (emit) {
        if (emit === void 0) { emit = true; }
        this.open = false;
        if (emit) {
            this.onClose.emit();
        }
    };
    StoDrawerComponent.prototype.openDrawer = function (emit) {
        if (emit === void 0) { emit = true; }
        this.open = true;
        if (emit) {
            this.onOpen.emit();
        }
    };
    StoDrawerComponent.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                var doNothing = false;
                for (var _i = 0, _a = event.path; _i < _a.length; _i++) {
                    var el = _a[_i];
                    if (el.tagName && el.tagName.toLowerCase().match(/drawer$/i)) {
                        doNothing = true;
                        break;
                    }
                }
                if (!doNothing && _this.open) {
                    _this.closeDrawer();
                }
            });
        }
    };
    StoDrawerComponent.prototype.ngOnInit = function () {
        if (!this.position) {
            this.position = 'left';
        }
    };
    return StoDrawerComponent;
}());
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "header", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "headerIcon", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "width", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "padding", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "position", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "closeOnClick", void 0);
__decorate([
    core_1.Output()
], StoDrawerComponent.prototype, "onToggle", void 0);
__decorate([
    core_1.Output()
], StoDrawerComponent.prototype, "onClose", void 0);
__decorate([
    core_1.Output()
], StoDrawerComponent.prototype, "onOpen", void 0);
__decorate([
    core_1.Input()
], StoDrawerComponent.prototype, "open", null);
StoDrawerComponent = __decorate([
    core_1.Component({
        selector: 'sto-drawer',
        templateUrl: './sto-drawer.component.html',
        styleUrls: ['./sto-drawer.component.scss'],
        animations: [
            animations_1.trigger('slideInOut', [
                animations_1.state('in', animations_1.style({
                    transform: 'translate3d(0%, 0, 0)',
                    visibility: 'visible',
                })),
                animations_1.state('outleft', animations_1.style({
                    transform: 'translate3d(-100%, 0, 0)',
                    visibility: 'hidden',
                })),
                animations_1.state('outright', animations_1.style({
                    transform: 'translate3d(100%, 0, 0)',
                    visibility: 'hidden',
                })),
                animations_1.transition('in <=> *', animations_1.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
            ])
        ]
    })
], StoDrawerComponent);
exports.StoDrawerComponent = StoDrawerComponent;
var StoDrawerWrapperComponent = (function () {
    function StoDrawerWrapperComponent() {
    }
    return StoDrawerWrapperComponent;
}());
StoDrawerWrapperComponent = __decorate([
    core_1.Component({
        selector: 'sto-drawer-wrapper',
        templateUrl: './sto-drawer-wrapper.component.html',
        styleUrls: ['./sto-drawer-wrapper.component.scss']
    })
], StoDrawerWrapperComponent);
exports.StoDrawerWrapperComponent = StoDrawerWrapperComponent;
var StoDrawerModule = (function () {
    function StoDrawerModule() {
    }
    return StoDrawerModule;
}());
StoDrawerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_button_directive_1.StoButtonModule],
        exports: [StoDrawerComponent, StoDrawerWrapperComponent],
        declarations: [StoDrawerComponent, StoDrawerWrapperComponent]
    })
], StoDrawerModule);
exports.StoDrawerModule = StoDrawerModule;

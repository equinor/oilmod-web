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
var SplitButton = (function () {
    function SplitButton(el, domHandler, renderer, router, cd) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.router = router;
        this.cd = cd;
        this.iconPos = 'left';
        this.onClick = new core_1.EventEmitter();
        this.menuVisible = false;
    }
    SplitButton.prototype.ngOnInit = function () {
        var _this = this;
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', function () {
            _this.menuVisible = false;
            _this.cd.markForCheck();
        });
    };
    SplitButton.prototype.onDefaultButtonClick = function (event) {
        this.onClick.emit(event);
    };
    SplitButton.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url || item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            if (!item.eventEmitter) {
                item.eventEmitter = new core_1.EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            item.eventEmitter.emit(event);
        }
        this.menuVisible = false;
        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    };
    SplitButton.prototype.onDropdownClick = function (event, menu, container) {
        this.menuVisible = !this.menuVisible;
        this.domHandler.relativePosition(menu, container);
        this.domHandler.fadeIn(menu, 25);
        menu.style.zIndex = String(++domhandler_1.DomHandler.zindex);
        event.stopPropagation();
    };
    SplitButton.prototype.ngOnDestroy = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    };
    return SplitButton;
}());
__decorate([
    core_1.Input()
], SplitButton.prototype, "model", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "icon", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "iconPos", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "label", void 0);
__decorate([
    core_1.Output()
], SplitButton.prototype, "onClick", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "style", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "menuStyle", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "menuStyleClass", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], SplitButton.prototype, "tabindex", void 0);
exports.SplitButton = SplitButton;
var SplitButtonModule = (function () {
    function SplitButtonModule() {
    }
    return SplitButtonModule;
}());
exports.SplitButtonModule = SplitButtonModule;

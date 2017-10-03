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
var OverlayPanel = (function () {
    function OverlayPanel(el, domHandler, renderer) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.dismissable = true;
        this.onBeforeShow = new core_1.EventEmitter();
        this.onAfterShow = new core_1.EventEmitter();
        this.onBeforeHide = new core_1.EventEmitter();
        this.onAfterHide = new core_1.EventEmitter();
        this.visible = false;
    }
    OverlayPanel.prototype.ngOnInit = function () {
        var _this = this;
        if (this.dismissable) {
            this.documentClickListener = this.renderer.listenGlobal('document', 'click', function () {
                if (!_this.selfClick && !_this.targetEvent) {
                    _this.hide();
                }
                _this.selfClick = false;
                _this.targetEvent = false;
            });
        }
    };
    OverlayPanel.prototype.ngAfterViewInit = function () {
        this.container = this.el.nativeElement.children[0];
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }
    };
    OverlayPanel.prototype.toggle = function (event, target) {
        var currentTarget = (target || event.currentTarget || event.target);
        if (!this.target || this.target == currentTarget) {
            if (this.visible)
                this.hide();
            else
                this.show(event, target);
        }
        else {
            this.show(event, target);
        }
        if (this.dismissable) {
            this.targetEvent = true;
        }
        this.target = currentTarget;
    };
    OverlayPanel.prototype.show = function (event, target) {
        if (this.dismissable) {
            this.targetEvent = true;
        }
        this.onBeforeShow.emit(null);
        var elementTarget = target || event.currentTarget || event.target;
        this.container.style.zIndex = ++domhandler_1.DomHandler.zindex;
        if (this.visible) {
            this.domHandler.absolutePosition(this.container, elementTarget);
        }
        else {
            this.visible = true;
            this.domHandler.absolutePosition(this.container, elementTarget);
            this.domHandler.fadeIn(this.container, 250);
        }
        this.onAfterShow.emit(null);
    };
    OverlayPanel.prototype.hide = function () {
        if (this.visible) {
            this.onBeforeHide.emit(null);
            this.visible = false;
            this.onAfterHide.emit(null);
        }
    };
    OverlayPanel.prototype.onPanelClick = function () {
        if (this.dismissable) {
            this.selfClick = true;
        }
    };
    OverlayPanel.prototype.onCloseClick = function (event) {
        this.hide();
        if (this.dismissable) {
            this.selfClick = true;
        }
        event.preventDefault();
    };
    OverlayPanel.prototype.ngOnDestroy = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
        this.target = null;
    };
    return OverlayPanel;
}());
__decorate([
    core_1.Input()
], OverlayPanel.prototype, "dismissable", void 0);
__decorate([
    core_1.Input()
], OverlayPanel.prototype, "showCloseIcon", void 0);
__decorate([
    core_1.Input()
], OverlayPanel.prototype, "style", void 0);
__decorate([
    core_1.Input()
], OverlayPanel.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], OverlayPanel.prototype, "appendTo", void 0);
__decorate([
    core_1.Output()
], OverlayPanel.prototype, "onBeforeShow", void 0);
__decorate([
    core_1.Output()
], OverlayPanel.prototype, "onAfterShow", void 0);
__decorate([
    core_1.Output()
], OverlayPanel.prototype, "onBeforeHide", void 0);
__decorate([
    core_1.Output()
], OverlayPanel.prototype, "onAfterHide", void 0);
exports.OverlayPanel = OverlayPanel;
var OverlayPanelModule = (function () {
    function OverlayPanelModule() {
    }
    return OverlayPanelModule;
}());
exports.OverlayPanelModule = OverlayPanelModule;

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
var Tooltip = (function () {
    function Tooltip(el, domHandler) {
        this.el = el;
        this.domHandler = domHandler;
        this.tooltipPosition = 'right';
        this.tooltipEvent = 'hover';
        this.appendTo = 'body';
        this.escape = true;
    }
    Tooltip.prototype.onMouseEnter = function (e) {
        if (this.tooltipEvent === 'hover') {
            this.show();
        }
    };
    Tooltip.prototype.onMouseLeave = function (e) {
        if (this.tooltipEvent === 'hover') {
            this.hide();
        }
    };
    Tooltip.prototype.onFocus = function (e) {
        if (this.tooltipEvent === 'focus') {
            this.show();
        }
    };
    Tooltip.prototype.onBlur = function (e) {
        if (this.tooltipEvent === 'focus') {
            this.hide();
        }
    };
    Tooltip.prototype.show = function () {
        if (!this.text || this.disabled) {
            return;
        }
        this.create();
        var offset = (this.appendTo !== 'body') ? { left: 0, top: 0 } : this.domHandler.getOffset(this.el.nativeElement);
        var targetTop = offset.top;
        var targetLeft = offset.left;
        var left;
        var top;
        this.container.style.display = 'block';
        switch (this.tooltipPosition) {
            case 'right':
                left = targetLeft + this.domHandler.getOuterWidth(this.el.nativeElement);
                top = targetTop + (this.domHandler.getOuterHeight(this.el.nativeElement) - this.domHandler.getOuterHeight(this.container)) / 2;
                break;
            case 'left':
                left = targetLeft - this.domHandler.getOuterWidth(this.container);
                top = targetTop + (this.domHandler.getOuterHeight(this.el.nativeElement) - this.domHandler.getOuterHeight(this.container)) / 2;
                break;
            case 'top':
                left = targetLeft + (this.domHandler.getOuterWidth(this.el.nativeElement) - this.domHandler.getOuterWidth(this.container)) / 2;
                top = targetTop - this.domHandler.getOuterHeight(this.container);
                break;
            case 'bottom':
                left = targetLeft + (this.domHandler.getOuterWidth(this.el.nativeElement) - this.domHandler.getOuterWidth(this.container)) / 2;
                top = targetTop + this.domHandler.getOuterHeight(this.el.nativeElement);
                break;
        }
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
        this.domHandler.fadeIn(this.container, 250);
        this.container.style.zIndex = ++domhandler_1.DomHandler.zindex;
    };
    Tooltip.prototype.hide = function () {
        this.ngOnDestroy();
    };
    Tooltip.prototype.create = function () {
        var styleClass = 'ui-widget ui-tooltip ui-tooltip-' + this.tooltipPosition;
        this.container = document.createElement('div');
        if (this.tooltipStyleClass) {
            styleClass += ' ' + this.tooltipStyleClass;
        }
        this.container.className = styleClass;
        var tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'ui-tooltip-arrow';
        this.container.appendChild(tooltipArrow);
        var tooltipText = document.createElement('div');
        tooltipText.className = 'ui-tooltip-text ui-shadow ui-corner-all';
        if (this.escape)
            tooltipText.appendChild(document.createTextNode(this.text));
        else
            tooltipText.innerHTML = this.text;
        if (this.positionStyle) {
            this.container.style.position = this.positionStyle;
        }
        this.container.appendChild(tooltipText);
        if (this.appendTo === 'body')
            document.body.appendChild(this.container);
        else if (this.appendTo === 'target')
            this.domHandler.appendChild(this.container, this.el.nativeElement);
        else
            this.domHandler.appendChild(this.container, this.appendTo);
    };
    Tooltip.prototype.ngOnDestroy = function () {
        if (this.container && this.container.parentElement) {
            if (this.appendTo === 'body')
                document.body.removeChild(this.container);
            else if (this.appendTo === 'target')
                this.el.nativeElement.removeChild(this.container);
            else
                this.domHandler.removeChild(this.container, this.appendTo);
        }
        this.container = null;
    };
    return Tooltip;
}());
__decorate([
    core_1.Input('pTooltip')
], Tooltip.prototype, "text", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "tooltipPosition", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "tooltipEvent", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "appendTo", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "positionStyle", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "tooltipStyleClass", void 0);
__decorate([
    core_1.Input("tooltipDisabled")
], Tooltip.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], Tooltip.prototype, "escape", void 0);
__decorate([
    core_1.HostListener('mouseenter', ['$event'])
], Tooltip.prototype, "onMouseEnter", null);
__decorate([
    core_1.HostListener('mouseleave', ['$event'])
], Tooltip.prototype, "onMouseLeave", null);
__decorate([
    core_1.HostListener('focus', ['$event'])
], Tooltip.prototype, "onFocus", null);
__decorate([
    core_1.HostListener('blur', ['$event'])
], Tooltip.prototype, "onBlur", null);
exports.Tooltip = Tooltip;
var TooltipModule = (function () {
    function TooltipModule() {
    }
    return TooltipModule;
}());
exports.TooltipModule = TooltipModule;

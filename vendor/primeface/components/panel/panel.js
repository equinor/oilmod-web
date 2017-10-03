"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Panel = (function () {
    function Panel(el) {
        this.el = el;
        this.collapsed = false;
        this.collapsedChange = new core_1.EventEmitter();
        this.onBeforeToggle = new core_1.EventEmitter();
        this.onAfterToggle = new core_1.EventEmitter();
    }
    Panel.prototype.toggle = function (event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.toggleable) {
            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        event.preventDefault();
    };
    Panel.prototype.expand = function (event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    };
    Panel.prototype.collapse = function (event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    };
    Panel.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Panel.prototype.onToggleDone = function (event) {
        this.animating = false;
    };
    return Panel;
}());
__decorate([
    core_1.Input()
], Panel.prototype, "toggleable", void 0);
__decorate([
    core_1.Input()
], Panel.prototype, "header", void 0);
__decorate([
    core_1.Input()
], Panel.prototype, "collapsed", void 0);
__decorate([
    core_1.Input()
], Panel.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Panel.prototype, "styleClass", void 0);
__decorate([
    core_1.Output()
], Panel.prototype, "collapsedChange", void 0);
__decorate([
    core_1.Output()
], Panel.prototype, "onBeforeToggle", void 0);
__decorate([
    core_1.Output()
], Panel.prototype, "onAfterToggle", void 0);
exports.Panel = Panel;
var PanelModule = (function () {
    function PanelModule() {
    }
    return PanelModule;
}());
exports.PanelModule = PanelModule;

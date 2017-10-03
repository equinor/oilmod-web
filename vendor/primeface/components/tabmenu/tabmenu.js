"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TabMenu = (function () {
    function TabMenu() {
    }
    TabMenu.prototype.ngOnInit = function () {
        if (!this.activeItem && this.model && this.model.length) {
            this.activeItem = this.model[0];
        }
    };
    TabMenu.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            if (!item.eventEmitter) {
                item.eventEmitter = new core_1.EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }
        this.activeItem = item;
    };
    TabMenu.prototype.ngOnDestroy = function () {
        if (this.model) {
            for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
                var item = _a[_i];
                this.unsubscribe(item);
            }
        }
    };
    TabMenu.prototype.unsubscribe = function (item) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }
        if (item.items) {
            for (var _i = 0, _a = item.items; _i < _a.length; _i++) {
                var childItem = _a[_i];
                this.unsubscribe(childItem);
            }
        }
    };
    return TabMenu;
}());
__decorate([
    core_1.Input()
], TabMenu.prototype, "model", void 0);
__decorate([
    core_1.Input()
], TabMenu.prototype, "activeItem", void 0);
__decorate([
    core_1.Input()
], TabMenu.prototype, "popup", void 0);
__decorate([
    core_1.Input()
], TabMenu.prototype, "style", void 0);
__decorate([
    core_1.Input()
], TabMenu.prototype, "styleClass", void 0);
exports.TabMenu = TabMenu;
var TabMenuModule = (function () {
    function TabMenuModule() {
    }
    return TabMenuModule;
}());
exports.TabMenuModule = TabMenuModule;

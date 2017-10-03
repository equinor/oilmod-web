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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var contextmenu_1 = require("../../vendor/primeface/components/contextmenu/contextmenu");
var StoContextMenuSubComponent = (function (_super) {
    __extends(StoContextMenuSubComponent, _super);
    function StoContextMenuSubComponent(domHandler, contextMenu) {
        var _this = _super.call(this, domHandler, contextMenu) || this;
        _this.domHandler = domHandler;
        _this.contextMenu = contextMenu;
        return _this;
    }
    return StoContextMenuSubComponent;
}(contextmenu_1.ContextMenuSub));
StoContextMenuSubComponent = __decorate([
    core_1.Component({
        selector: 'sto-contextMenuSub',
        template: "\n\t  <ul [ngClass]=\"{'ui-helper-reset':root, 'ui-widget-content ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow':!root}\" class=\"ui-menu-list\"\n\t\t  (click)=\"listClick($event)\">\n\t\t  <ng-template ngFor let-child [ngForOf]=\"(root ? item : item.items)\">\n\t\t\t  <li #item [ngClass]=\"{'ui-menuitem ui-widget ui-corner-all':true,'ui-menu-parent':child.items,'ui-menuitem-active':item==activeItem}\"\n\t\t\t\t  (mouseenter)=\"onItemMouseEnter($event,item,child)\" (mouseleave)=\"onItemMouseLeave($event,item)\">\n\t\t\t\t  <a *ngIf=\"!child.routerLink\" [href]=\"child.url||'#'\" class=\"ui-menuitem-link ui-corner-all\" [attr.target]=\"child.target\"\n\t\t\t\t\t [ngClass]=\"{'ui-state-disabled':child.disabled}\" (click)=\"itemClick($event, child)\">\n\t\t\t\t\t  <span class=\"ui-submenu-icon fa fa-fw fa-caret-right\" *ngIf=\"child.items\"></span>\n\t\t\t\t\t  <span class=\"ui-menuitem-icon fa fa-fw\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n\t\t\t\t\t  <span class=\"ui-menuitem-text\">{{child.label}}</span>\n\t\t\t\t  </a>\n\t\t\t\t  <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" [routerLinkActive]=\"'ui-state-active'\" class=\"ui-menuitem-link ui-corner-all\" [attr.target]=\"child.target\"\n\t\t\t\t\t [ngClass]=\"{'ui-state-disabled':child.disabled}\" (click)=\"itemClick($event, child)\">\n\t\t\t\t\t  <span class=\"ui-submenu-icon fa fa-fw fa-caret-right\" *ngIf=\"child.items\"></span>\n\t\t\t\t\t  <span class=\"ui-menuitem-icon fa fa-fw\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n\t\t\t\t\t  <span class=\"ui-menuitem-text\">{{child.label}}</span>\n\t\t\t\t  </a>\n\t\t\t\t  <sto-contextMenuSub class=\"ui-submenu\" [item]=\"child\" *ngIf=\"child.items\"></sto-contextMenuSub>\n\t\t\t  </li>\n\t\t  </ng-template>\n\t  </ul>\n  ",
        providers: [domhandler_1.DomHandler]
    }),
    __param(1, core_1.Inject(core_1.forwardRef(function () { return StoContextMenuComponent; })))
], StoContextMenuSubComponent);
exports.StoContextMenuSubComponent = StoContextMenuSubComponent;
var StoContextMenuComponent = (function (_super) {
    __extends(StoContextMenuComponent, _super);
    function StoContextMenuComponent(el, domHandler, renderer) {
        var _this = _super.call(this, el, domHandler, renderer) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        return _this;
    }
    return StoContextMenuComponent;
}(contextmenu_1.ContextMenu));
StoContextMenuComponent = __decorate([
    core_1.Component({
        selector: 'sto-contextMenu',
        template: "\n\t  <div #container [ngClass]=\"'ui-contextmenu ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-menu-dynamic ui-shadow'\"\n\t\t   [class]=\"styleClass\" [ngStyle]=\"style\" [style.display]=\"visible ? 'block' : 'none'\">\n\t\t  <sto-contextMenuSub [item]=\"model\" root=\"root\"></sto-contextMenuSub>\n\t  </div>\n  ",
        styleUrls: ['../sto-menu/sto-menu.component.scss'],
        providers: [domhandler_1.DomHandler]
    })
], StoContextMenuComponent);
exports.StoContextMenuComponent = StoContextMenuComponent;
var StoContextMenuModule = (function () {
    function StoContextMenuModule() {
    }
    return StoContextMenuModule;
}());
StoContextMenuModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, router_1.RouterModule],
        exports: [StoContextMenuComponent, router_1.RouterModule],
        declarations: [StoContextMenuComponent, StoContextMenuSubComponent]
    })
], StoContextMenuModule);
exports.StoContextMenuModule = StoContextMenuModule;

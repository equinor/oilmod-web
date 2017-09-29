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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../../../vendor/primeface/components/dom/domhandler");
var menubar_1 = require("../../../vendor/primeface/components/menubar/menubar");
var StoNavbarSubComponent = (function (_super) {
    __extends(StoNavbarSubComponent, _super);
    function StoNavbarSubComponent(domHandler, eref) {
        var _this = _super.call(this, domHandler) || this;
        _this.domHandler = domHandler;
        _this.eref = eref;
        _this.isOpen = false;
        return _this;
    }
    StoNavbarSubComponent.prototype.onClick = function (event) {
        if (this.root) {
            if (!this.eref.nativeElement.contains(event.target)) {
                this.activeItem = null;
                this.isOpen = false;
            }
        }
    };
    StoNavbarSubComponent.prototype.listClick = function (event) {
        if (this.root && !this.isOpen) {
            this.isOpen = true;
        }
        else {
            this.isOpen = false;
            _super.prototype.listClick.call(this, event);
        }
    };
    StoNavbarSubComponent.prototype.onItemMouseEnter = function (event, item, menuitem) {
        if (this.root) {
            return;
        }
        _super.prototype.onItemMouseEnter.call(this, event, item, menuitem);
    };
    StoNavbarSubComponent.prototype.onItemMouseLeave = function (event, link) {
        if (this.root) {
            return;
        }
        _super.prototype.onItemMouseLeave.call(this, event, link);
    };
    StoNavbarSubComponent.prototype.onItemClick = function (event, item, menuitem) {
        if (this.root && !menuitem.url) {
            event.preventDefault();
            this.activeItem = item;
            var nextElement = item.children[0].nextElementSibling;
            var sublist = nextElement.children[0];
            sublist.style.zIndex = ++domhandler_1.DomHandler.zindex;
            sublist.style.top = this.domHandler.getOuterHeight(item.children[0]) + 'px';
            sublist.style.left = '0px';
        }
        else {
            _super.prototype.itemClick.call(this, event, menuitem);
        }
    };
    return StoNavbarSubComponent;
}(menubar_1.MenubarSub));
StoNavbarSubComponent = __decorate([
    core_1.Component({
        selector: 'sto-navbarSub',
        templateUrl: 'sto-navbar-sub.component.html',
        providers: [domhandler_1.DomHandler],
        host: {
            '(document:click)': 'onClick($event)',
        },
    })
], StoNavbarSubComponent);
exports.StoNavbarSubComponent = StoNavbarSubComponent;

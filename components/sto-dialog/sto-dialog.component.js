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
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var common_1 = require("@angular/common");
var animations_1 = require("@angular/animations");
var dialog_1 = require("../../vendor/primeface/components/dialog/dialog");
var sto_shared_1 = require("../sto-shared/sto-shared");
var StoDialogComponent = (function (_super) {
    __extends(StoDialogComponent, _super);
    function StoDialogComponent(el, domHandler, renderer) {
        var _this = _super.call(this, el, domHandler, renderer) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        return _this;
    }
    return StoDialogComponent;
}(dialog_1.Dialog));
StoDialogComponent = __decorate([
    core_1.Component({
        selector: 'sto-dialog',
        templateUrl: './sto-dialog.component.html',
        styleUrls: ['./sto-dialog.component.scss'],
        animations: [
            animations_1.trigger('dialogState', [
                animations_1.state('hidden', animations_1.style({
                    opacity: 0
                })),
                animations_1.state('visible', animations_1.style({
                    opacity: 1
                })),
                animations_1.transition('visible => hidden', animations_1.animate('400ms ease-in')),
                animations_1.transition('hidden => visible', animations_1.animate('400ms ease-out'))
            ])
        ],
        providers: [domhandler_1.DomHandler]
    })
], StoDialogComponent);
exports.StoDialogComponent = StoDialogComponent;
var StoDialogModule = (function () {
    function StoDialogModule() {
    }
    return StoDialogModule;
}());
StoDialogModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_shared_1.StoSharedModule],
        exports: [StoDialogComponent, sto_shared_1.StoSharedModule],
        declarations: [StoDialogComponent]
    })
], StoDialogModule);
exports.StoDialogModule = StoDialogModule;

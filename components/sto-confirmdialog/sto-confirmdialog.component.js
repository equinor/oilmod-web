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
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var common_1 = require("@angular/common");
var animations_1 = require("@angular/animations");
var confirmdialog_1 = require("../../vendor/primeface/components/confirmdialog/confirmdialog");
var sto_shared_1 = require("../sto-shared/sto-shared");
var api_1 = require("../../vendor/primeface/components/common/api");
exports.ConfirmationService = api_1.ConfirmationService;
var StoConfirmDialog = (function (_super) {
    __extends(StoConfirmDialog, _super);
    function StoConfirmDialog(el, domHandler, renderer, confirmationService) {
        var _this = _super.call(this, el, domHandler, renderer, confirmationService) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.confirmationService = confirmationService;
        return _this;
    }
    return StoConfirmDialog;
}(confirmdialog_1.ConfirmDialog));
StoConfirmDialog = __decorate([
    core_1.Component({
        selector: 'sto-confirmDialog',
        templateUrl: './sto-confirmdialog.component.html',
        styleUrls: ['../sto-dialog/sto-dialog.component.scss'],
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
], StoConfirmDialog);
exports.StoConfirmDialog = StoConfirmDialog;
var StoConfirmDialogModule = (function () {
    function StoConfirmDialogModule() {
    }
    return StoConfirmDialogModule;
}());
StoConfirmDialogModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_button_directive_1.StoButtonModule, sto_shared_1.StoSharedModule],
        exports: [StoConfirmDialog],
        declarations: [StoConfirmDialog]
    })
], StoConfirmDialogModule);
exports.StoConfirmDialogModule = StoConfirmDialogModule;

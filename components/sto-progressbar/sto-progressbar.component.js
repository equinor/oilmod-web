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
var common_1 = require("@angular/common");
var progressbar_1 = require("../../vendor/primeface/components/progressbar/progressbar");
var StoProgressBar = (function (_super) {
    __extends(StoProgressBar, _super);
    function StoProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoProgressBar;
}(progressbar_1.ProgressBar));
StoProgressBar = __decorate([
    core_1.Component({
        selector: 'sto-progressBar',
        templateUrl: './sto-progressbar.component.html'
    })
], StoProgressBar);
exports.StoProgressBar = StoProgressBar;
var StoProgressBarModule = (function () {
    function StoProgressBarModule() {
    }
    return StoProgressBarModule;
}());
StoProgressBarModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoProgressBar],
        declarations: [StoProgressBar]
    })
], StoProgressBarModule);
exports.StoProgressBarModule = StoProgressBarModule;

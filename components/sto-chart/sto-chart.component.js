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
var chart_1 = require("../../vendor/primeface/components/chart/chart");
var StoChartComponent = (function (_super) {
    __extends(StoChartComponent, _super);
    function StoChartComponent(el) {
        var _this = _super.call(this, el) || this;
        _this.el = el;
        return _this;
    }
    return StoChartComponent;
}(chart_1.UIChart));
StoChartComponent = __decorate([
    core_1.Component({
        selector: 'sto-chart',
        templateUrl: 'sto-chart.component.html'
    })
], StoChartComponent);
exports.StoChartComponent = StoChartComponent;
var StoChartModule = (function () {
    function StoChartModule() {
    }
    return StoChartModule;
}());
StoChartModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoChartComponent],
        declarations: [StoChartComponent]
    })
], StoChartModule);
exports.StoChartModule = StoChartModule;

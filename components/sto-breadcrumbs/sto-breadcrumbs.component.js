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
var router_1 = require("@angular/router");
var breadcrumb_1 = require("../../vendor/primeface/components/breadcrumb/breadcrumb");
var StoBreadcrumbsComponent = (function (_super) {
    __extends(StoBreadcrumbsComponent, _super);
    function StoBreadcrumbsComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoBreadcrumbsComponent;
}(breadcrumb_1.Breadcrumb));
StoBreadcrumbsComponent = __decorate([
    core_1.Component({
        selector: 'sto-breadcrumbs',
        templateUrl: './sto-breadcrumbs.component.html',
        styleUrls: ['./sto-breadcrumbs.component.scss']
    })
], StoBreadcrumbsComponent);
exports.StoBreadcrumbsComponent = StoBreadcrumbsComponent;
var StoBreadcrumbsModule = (function () {
    function StoBreadcrumbsModule() {
    }
    return StoBreadcrumbsModule;
}());
StoBreadcrumbsModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, router_1.RouterModule],
        exports: [StoBreadcrumbsComponent],
        declarations: [StoBreadcrumbsComponent]
    })
], StoBreadcrumbsModule);
exports.StoBreadcrumbsModule = StoBreadcrumbsModule;

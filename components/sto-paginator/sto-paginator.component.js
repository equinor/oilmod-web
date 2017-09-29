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
var paginator_1 = require("../../vendor/primeface/components/paginator/paginator");
var StoPaginator = (function (_super) {
    __extends(StoPaginator, _super);
    function StoPaginator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoPaginator;
}(paginator_1.Paginator));
StoPaginator = __decorate([
    core_1.Component({
        selector: 'sto-paginator',
        templateUrl: './sto-paginator.component.html',
        styleUrls: ['./sto-paginator.component.scss']
    })
], StoPaginator);
exports.StoPaginator = StoPaginator;
var StoPaginatorModule = (function () {
    function StoPaginatorModule() {
    }
    return StoPaginatorModule;
}());
StoPaginatorModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoPaginator],
        declarations: [StoPaginator]
    })
], StoPaginatorModule);
exports.StoPaginatorModule = StoPaginatorModule;

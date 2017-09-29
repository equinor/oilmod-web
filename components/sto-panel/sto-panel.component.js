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
var panel_1 = require("../../vendor/primeface/components/panel/panel");
var animations_1 = require("@angular/animations");
var StoPanelComponent = (function (_super) {
    __extends(StoPanelComponent, _super);
    function StoPanelComponent(el) {
        var _this = _super.call(this, el) || this;
        _this.el = el;
        return _this;
    }
    return StoPanelComponent;
}(panel_1.Panel));
StoPanelComponent = __decorate([
    core_1.Component({
        selector: 'sto-panel',
        templateUrl: 'sto-panel.component.html',
        styleUrls: ['sto-panel.component.scss'],
        animations: [
            animations_1.trigger('panelContent', [
                animations_1.state('hidden', animations_1.style({
                    height: '0'
                })),
                animations_1.state('visible', animations_1.style({
                    height: '*'
                })),
                animations_1.transition('visible <=> hidden', animations_1.animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
            ])
        ]
    })
], StoPanelComponent);
exports.StoPanelComponent = StoPanelComponent;
var StoPanelModule = (function () {
    function StoPanelModule() {
    }
    return StoPanelModule;
}());
StoPanelModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [StoPanelComponent],
        declarations: [StoPanelComponent]
    })
], StoPanelModule);
exports.StoPanelModule = StoPanelModule;

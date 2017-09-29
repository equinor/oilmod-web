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
var scroller_component_1 = require("../../../../vendor/ngx-datatable/components/body/scroller.component");
var StoScrollerComponent = (function (_super) {
    __extends(StoScrollerComponent, _super);
    function StoScrollerComponent(element, renderer) {
        var _this = _super.call(this, element, renderer) || this;
        _this.offset = 36; //TODO FIX
        return _this;
    }
    Object.defineProperty(StoScrollerComponent.prototype, "scrollHeight", {
        set: function (val) {
            this._scrollHeight = val + this.offset;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return StoScrollerComponent;
}(scroller_component_1.ScrollerComponent));
__decorate([
    core_1.Input()
], StoScrollerComponent.prototype, "offset", void 0);
__decorate([
    core_1.Input()
], StoScrollerComponent.prototype, "scrollHeight", null);
StoScrollerComponent = __decorate([
    core_1.Component({
        selector: 'sto-datatable-scroller',
        template: "\n\t  <ng-content></ng-content>\n  ",
        host: {
            class: 'datatable-scroll'
        },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    })
], StoScrollerComponent);
exports.StoScrollerComponent = StoScrollerComponent;

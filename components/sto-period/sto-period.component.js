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
var calendar_1 = require("../../vendor/primeface/components/calendar/calendar");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var common_1 = require("@angular/common");
var animations_1 = require("@angular/animations");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var forms_1 = require("@angular/forms");
exports.PERIOD_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoPeriodComponent; }),
    multi: true
};
exports.PERIOD_VALIDATOR = {
    provide: forms_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return StoPeriodComponent; }),
    multi: true
};
var StoPeriodComponent = (function (_super) {
    __extends(StoPeriodComponent, _super);
    function StoPeriodComponent(el, domHandler, renderer, cd) {
        var _this = _super.call(this, el, domHandler, renderer, cd) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.cd = cd;
        _this.datePipe = new common_1.DatePipe('en-us');
        _this.months = [
            [{
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 0,
                    label: 'Jan'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 1,
                    label: 'Feb'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 2,
                    label: 'Mar'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 3,
                    label: 'Apr'
                }], [{
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 4,
                    label: 'May'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 5,
                    label: 'Jun'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 6,
                    label: 'Jul'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 7,
                    label: 'Aug'
                }], [{
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 8,
                    label: 'Sep'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 9,
                    label: 'Oct'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 10,
                    label: 'Nov'
                }, {
                    day: 1,
                    selectable: true,
                    today: false,
                    year: _this.currentYear,
                    month: 11,
                    label: 'Dec'
                }]
        ];
        _this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return _this;
    }
    StoPeriodComponent.prototype.moveYear = function (direction) {
        switch (direction) {
            case '+':
                this.currentYear += 1;
                break;
            case '-':
                this.currentYear -= 1;
                break;
        }
    };
    StoPeriodComponent.prototype.isCurrentMonth = function (m) {
        var current = new Date().getMonth();
        return current === m;
    };
    StoPeriodComponent.prototype.isSelectedMonth = function (m) {
        return this.datePipe.transform(new Date(this.currentYear, m, 1), 'y-MMM') === this.inputFieldValue;
    };
    StoPeriodComponent.prototype.newMonth = function (month) {
        var fakeEvent = {
            preventDefault: function () {
            }
        };
        this.onDateSelect(fakeEvent, {
            day: 1,
            month: month,
            selectable: true,
            today: false,
            year: this.currentYear
        });
    };
    return StoPeriodComponent;
}(calendar_1.Calendar));
StoPeriodComponent = __decorate([
    core_1.Component({
        selector: 'sto-period',
        templateUrl: './sto-period.component.html',
        styleUrls: ['./sto-period.component.scss'],
        animations: [
            animations_1.trigger('overlayState', [
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
        providers: [domhandler_1.DomHandler, exports.PERIOD_VALUE_ACCESSOR, exports.PERIOD_VALIDATOR]
    })
], StoPeriodComponent);
exports.StoPeriodComponent = StoPeriodComponent;
var StoPeriodModule = (function () {
    function StoPeriodModule() {
    }
    return StoPeriodModule;
}());
StoPeriodModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_button_directive_1.StoButtonModule],
        exports: [StoPeriodComponent, sto_button_directive_1.StoButtonModule],
        declarations: [StoPeriodComponent]
    })
], StoPeriodModule);
exports.StoPeriodModule = StoPeriodModule;

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
var date_fns_1 = require("date-fns");
exports.CALENDAR_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StoCalendarComponent; }),
    multi: true
};
exports.CALENDAR_VALIDATOR = {
    provide: forms_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return StoCalendarComponent; }),
    multi: true
};
var StoCalendarComponent = (function (_super) {
    __extends(StoCalendarComponent, _super);
    function StoCalendarComponent(el, domHandler, renderer, cd) {
        var _this = _super.call(this, el, domHandler, renderer, cd) || this;
        _this.el = el;
        _this.domHandler = domHandler;
        _this.renderer = renderer;
        _this.cd = cd;
        _this.dateFormat = 'yy-M-dd';
        _this.selectOtherMonths = true;
        _this._locale = {
            firstDayOfWeek: 1,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        return _this;
    }
    StoCalendarComponent.prototype.writeValue = function (value) {
        if (value) {
            var tempValue = typeof value === 'string' ? new Date(value) : value;
            this.value = date_fns_1.isValid(tempValue) ? tempValue : null;
            if (this.value && typeof this.value === 'string') {
                this.value = this.parseValueFromString(this.value);
            }
        }
        this.updateInputfield();
        this.updateUI();
    };
    return StoCalendarComponent;
}(calendar_1.Calendar));
__decorate([
    core_1.Input()
], StoCalendarComponent.prototype, "dateFormat", void 0);
__decorate([
    core_1.Input()
], StoCalendarComponent.prototype, "selectOtherMonths", void 0);
StoCalendarComponent = __decorate([
    core_1.Component({
        selector: 'sto-calendar',
        templateUrl: 'sto-calendar.component.html',
        styleUrls: ['sto-calendar.component.scss'],
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
        providers: [domhandler_1.DomHandler, exports.CALENDAR_VALUE_ACCESSOR, exports.CALENDAR_VALIDATOR]
    })
], StoCalendarComponent);
exports.StoCalendarComponent = StoCalendarComponent;
var StoCalendarModule = (function () {
    function StoCalendarModule() {
    }
    return StoCalendarModule;
}());
StoCalendarModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_button_directive_1.StoButtonModule],
        exports: [StoCalendarComponent, sto_button_directive_1.StoButtonModule],
        declarations: [StoCalendarComponent]
    })
], StoCalendarModule);
exports.StoCalendarModule = StoCalendarModule;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var sto_calendar_component_1 = require("../sto-calendar/sto-calendar.component");
var sto_daterange_component_1 = require("./sto-daterange.component");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var StoDaterangeModule = (function () {
    function StoDaterangeModule() {
    }
    return StoDaterangeModule;
}());
StoDaterangeModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_calendar_component_1.StoCalendarModule, forms_1.ReactiveFormsModule, sto_button_directive_1.StoButtonModule],
        exports: [sto_daterange_component_1.StoDaterangeComponent],
        declarations: [sto_daterange_component_1.StoDaterangeComponent]
    })
], StoDaterangeModule);
exports.StoDaterangeModule = StoDaterangeModule;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var InputTextarea = (function () {
    function InputTextarea(el) {
        this.el = el;
    }
    InputTextarea.prototype.ngOnInit = function () {
        this.rowsDefault = this.rows;
        this.colsDefault = this.cols;
    };
    InputTextarea.prototype.ngDoCheck = function () {
        this.updateFilledState();
    };
    //To trigger change detection to manage ui-state-filled for material labels when there is no value binding
    InputTextarea.prototype.onInput = function (e) {
        this.updateFilledState();
    };
    InputTextarea.prototype.updateFilledState = function () {
        this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    };
    InputTextarea.prototype.onFocus = function (e) {
        if (this.autoResize) {
            this.resize();
        }
    };
    InputTextarea.prototype.onBlur = function (e) {
        if (this.autoResize) {
            this.resize();
        }
    };
    InputTextarea.prototype.onKeyup = function (e) {
        if (this.autoResize) {
            this.resize();
        }
    };
    InputTextarea.prototype.resize = function () {
        var linesCount = 0, lines = this.el.nativeElement.value.split('\n');
        for (var i = lines.length - 1; i >= 0; --i) {
            linesCount += Math.floor((lines[i].length / this.colsDefault) + 1);
        }
        this.rows = (linesCount >= this.rowsDefault) ? (linesCount + 1) : this.rowsDefault;
    };
    return InputTextarea;
}());
__decorate([
    core_1.Input()
], InputTextarea.prototype, "autoResize", void 0);
__decorate([
    core_1.Input()
], InputTextarea.prototype, "rows", void 0);
__decorate([
    core_1.Input()
], InputTextarea.prototype, "cols", void 0);
__decorate([
    core_1.HostListener('input', ['$event'])
], InputTextarea.prototype, "onInput", null);
__decorate([
    core_1.HostListener('focus', ['$event'])
], InputTextarea.prototype, "onFocus", null);
__decorate([
    core_1.HostListener('blur', ['$event'])
], InputTextarea.prototype, "onBlur", null);
__decorate([
    core_1.HostListener('keyup', ['$event'])
], InputTextarea.prototype, "onKeyup", null);
exports.InputTextarea = InputTextarea;
var InputTextareaModule = (function () {
    function InputTextareaModule() {
    }
    return InputTextareaModule;
}());
exports.InputTextareaModule = InputTextareaModule;

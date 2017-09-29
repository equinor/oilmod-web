"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var animations_1 = require("@angular/animations");
require("rxjs/add/operator/debounceTime");
var domhandler_1 = require("../../vendor/primeface/components/dom/domhandler");
var date_fns_1 = require("date-fns");
var StoDaterangeComponent = StoDaterangeComponent_1 = (function () {
    function StoDaterangeComponent(fb, el, domHandler, renderer, cd) {
        this.fb = fb;
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.cd = cd;
        this.showIcon = true;
        this.icon = 'fa-calendar';
        this.onFocus = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.inputFieldValue = '';
        this.propagateChange = function (_) {
        };
    }
    StoDaterangeComponent.prototype.showOverlay = function (inputfield) {
        this.overlayVisible = true;
        this.overlayShown = true;
        this.overlay.style.zIndex = String(++domhandler_1.DomHandler.zindex);
        this.bindDocumentClickListener();
    };
    StoDaterangeComponent.prototype.onCancel = function () {
        this.overlayVisible = false;
        this.closeOverlay = true;
        this.form.setValue(this.initValues, { emitEvent: false });
    };
    StoDaterangeComponent.prototype.onSubmit = function () {
        this.overlayVisible = false;
        this.closeOverlay = true;
        var _a = this.form.value, start = _a.start, end = _a.end;
        if (start && end) {
            this.updateInputfield(this.form.value);
            this.propagateChange(this.form.value);
        }
    };
    StoDaterangeComponent.prototype.tenWeeks = function () {
        var values = {
            start: date_fns_1.subWeeks(new Date(), 2),
            end: date_fns_1.addWeeks(new Date(), 8)
        };
        this.form.setValue(values);
        this.onSubmit();
    };
    StoDaterangeComponent.prototype.periodPicker = function (unit, when) {
        var week = unit === 'week';
        var addFn = unit === 'week' ? date_fns_1.addWeeks : date_fns_1.addMonths;
        var subFn = unit === 'week' ? date_fns_1.subWeeks : date_fns_1.subMonths;
        var startFn = unit === 'week' ? date_fns_1.startOfWeek : date_fns_1.startOfMonth;
        var endFn = unit === 'week' ? date_fns_1.endOfWeek : date_fns_1.endOfMonth;
        switch (when) {
            case '-':
                this.form.setValue({
                    start: week ? date_fns_1.startOfWeek(subFn(new Date(), 1), { weekStartsOn: 1 }) : date_fns_1.startOfMonth(subFn(new Date(), 1)),
                    end: week ? date_fns_1.endOfWeek(subFn(new Date(), 1), { weekStartsOn: 1 }) : date_fns_1.endOfMonth(subFn(new Date(), 1))
                });
                break;
            case '+':
                this.form.setValue({
                    start: week ? date_fns_1.startOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : date_fns_1.startOfMonth(addFn(new Date(), 1)),
                    end: week ? date_fns_1.endOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : date_fns_1.endOfMonth(addFn(new Date(), 1))
                });
                break;
            default:
                this.form.setValue({
                    start: week ? date_fns_1.startOfWeek(new Date(), { weekStartsOn: 1 }) : date_fns_1.startOfMonth(new Date()),
                    end: week ? date_fns_1.endOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : date_fns_1.endOfMonth(new Date())
                });
                break;
        }
        this.onSubmit();
    };
    /**
     * This function creates a perf hit, as it triggers a global DOM listener for all click events
     */
    StoDaterangeComponent.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listenGlobal('document', 'click', function (event) {
                // Don't close if inside the date range picker
                for (var _i = 0, _a = event.path; _i < _a.length; _i++) {
                    var el = _a[_i];
                    if (el.localName === 'sto-calendar' || el.localName === 'sto-daterange') {
                        _this.closeOverlay = false;
                        break;
                    }
                }
                if (_this.closeOverlay) {
                    _this.overlayVisible = false;
                }
                _this.closeOverlay = true;
                _this.dateClick = false;
                _this.cd.detectChanges();
            });
        }
    };
    StoDaterangeComponent.prototype.onInputFocus = function (inputfield, event) {
        this.focus = true;
        this.showOverlay(inputfield);
        this.onFocus.emit(event);
    };
    StoDaterangeComponent.prototype.onButtonClick = function (event, inputfield) {
        this.closeOverlay = false;
        if (!this.overlay.offsetParent) {
            inputfield.focus();
            this.showOverlay(inputfield);
        }
        else {
            this.closeOverlay = true;
        }
    };
    StoDaterangeComponent.prototype.onInputBlur = function (event) {
        this.focus = false;
        this.onBlur.emit(event);
        // this.onModelTouched();
    };
    StoDaterangeComponent.prototype.updateInputfield = function (values) {
        if (values) {
            var start = date_fns_1.format(values.start, 'YYYY-MM-DD');
            var end = date_fns_1.format(values.end, 'YYYY-MM-DD');
            this.inputFieldValue = start + " - " + end;
        }
        else {
            this.inputFieldValue = '';
        }
    };
    StoDaterangeComponent.prototype.writeValue = function (value) {
        if (value && typeof value !== 'undefined') {
            if (value.hasOwnProperty('start') && value.hasOwnProperty('end') && Object.keys(value).length === 2) {
                var newValues = {};
                for (var key in value) {
                    if (value[key] instanceof Date) {
                        newValues[key] = value[key];
                    }
                    else if (!isNaN(new Date(value[key]).getTime())) {
                        newValues[key] = new Date(value[key]);
                    }
                }
                this.initValues = newValues;
                this.form.setValue(newValues);
                this.updateInputfield(newValues);
            }
        }
    };
    StoDaterangeComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    StoDaterangeComponent.prototype.registerOnTouched = function (fn) {
    };
    StoDaterangeComponent.prototype.ngOnDestroy = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    };
    StoDaterangeComponent.prototype.ngAfterViewInit = function () {
        this.overlay = this.overlayViewChild.nativeElement;
        if (this.appendTo) {
            if (this.appendTo === 'body') {
                document.body.appendChild(this.overlay);
            }
            else {
                this.domHandler.appendChild(this.overlay, this.appendTo);
            }
        }
    };
    StoDaterangeComponent.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            start: [null, forms_1.Validators.required],
            end: [null, forms_1.Validators.required]
        });
    };
    return StoDaterangeComponent;
}());
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "showIcon", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "icon", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "style", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "inputStyle", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "inputStyleClass", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "appendTo", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "inputId", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "required", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "monthNavigator", void 0);
__decorate([
    core_1.Input()
], StoDaterangeComponent.prototype, "yearNavigator", void 0);
__decorate([
    core_1.Output()
], StoDaterangeComponent.prototype, "onFocus", void 0);
__decorate([
    core_1.Output()
], StoDaterangeComponent.prototype, "onBlur", void 0);
__decorate([
    core_1.ViewChild('datepicker')
], StoDaterangeComponent.prototype, "overlayViewChild", void 0);
StoDaterangeComponent = StoDaterangeComponent_1 = __decorate([
    core_1.Component({
        selector: 'sto-daterange',
        templateUrl: './sto-daterange.component.html',
        styleUrls: ['./sto-daterange.component.scss'],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return StoDaterangeComponent_1; }),
                multi: true
            },
            domhandler_1.DomHandler
        ],
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
        ]
    })
], StoDaterangeComponent);
exports.StoDaterangeComponent = StoDaterangeComponent;
var StoDaterangeComponent_1;

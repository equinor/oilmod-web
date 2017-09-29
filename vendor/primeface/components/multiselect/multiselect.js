"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../dom/domhandler");
var forms_1 = require("@angular/forms");
exports.MULTISELECT_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MultiSelect; }),
    multi: true
};
var MultiSelect = (function () {
    function MultiSelect(el, domHandler, renderer, differs, objectUtils) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.objectUtils = objectUtils;
        this.onChange = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.scrollHeight = '200px';
        this.defaultLabel = 'Choose';
        this.displaySelectedLabel = true;
        this.maxSelectedLabels = 3;
        this.selectedItemsLabel = '{0} items selected';
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
        this.differ = differs.find([]).create(null);
    }
    MultiSelect.prototype.ngOnInit = function () {
        var _this = this;
        this.updateLabel();
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', function () {
            if (!_this.selfClick && !_this.panelClick && _this.overlayVisible) {
                _this.hide();
            }
            _this.selfClick = false;
            _this.panelClick = false;
        });
    };
    MultiSelect.prototype.ngAfterViewInit = function () {
        this.container = this.containerViewChild.nativeElement;
        this.panel = this.panelViewChild.nativeElement;
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }
        if (this.overlayVisible) {
            this.show();
        }
    };
    MultiSelect.prototype.ngAfterViewChecked = function () {
        if (this.filtered) {
            this.domHandler.relativePosition(this.panel, this.container);
            this.filtered = false;
        }
    };
    MultiSelect.prototype.ngDoCheck = function () {
        var changes = this.differ.diff(this.value);
        if (changes) {
            this.updateLabel();
        }
    };
    MultiSelect.prototype.writeValue = function (value) {
        this.value = value;
        this.updateLabel();
    };
    MultiSelect.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    MultiSelect.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    MultiSelect.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    MultiSelect.prototype.onItemClick = function (event, value) {
        var selectionIndex = this.findSelectionIndex(value);
        if (selectionIndex != -1)
            this.value = this.value.filter(function (val, i) { return i != selectionIndex; });
        else
            this.value = (this.value || []).concat([value]);
        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value });
    };
    MultiSelect.prototype.isSelected = function (value) {
        return this.findSelectionIndex(value) != -1;
    };
    MultiSelect.prototype.findSelectionIndex = function (val) {
        var index = -1;
        if (this.value) {
            for (var i = 0; i < this.value.length; i++) {
                if (this.objectUtils.equals(this.value[i], val, this.dataKey)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };
    MultiSelect.prototype.toggleAll = function (event, checkbox) {
        if (checkbox.checked) {
            this.value = [];
        }
        else {
            var opts = this.getVisibleOptions();
            if (opts) {
                this.value = [];
                for (var i = 0; i < opts.length; i++) {
                    this.value.push(opts[i].value);
                }
            }
        }
        checkbox.checked = !checkbox.checked;
        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value });
    };
    MultiSelect.prototype.isAllChecked = function () {
        if (this.filterValue && this.filterValue.trim().length)
            return this.value && this.visibleOptions && this.visibleOptions.length && (this.value.length == this.visibleOptions.length);
        else
            return this.value && this.options && (this.value.length == this.options.length);
    };
    MultiSelect.prototype.show = function () {
        this.overlayVisible = true;
        this.panel.style.zIndex = String(++domhandler_1.DomHandler.zindex);
        if (this.appendTo)
            this.domHandler.absolutePosition(this.panel, this.container);
        else
            this.domHandler.relativePosition(this.panel, this.container);
        this.domHandler.fadeIn(this.panel, 250);
    };
    MultiSelect.prototype.hide = function () {
        this.overlayVisible = false;
    };
    MultiSelect.prototype.close = function (event) {
        this.hide();
        event.preventDefault();
    };
    MultiSelect.prototype.onMouseclick = function (event, input) {
        if (this.disabled) {
            return;
        }
        if (!this.panelClick) {
            if (this.overlayVisible) {
                this.hide();
            }
            else {
                input.focus();
                this.show();
            }
        }
        this.selfClick = true;
    };
    MultiSelect.prototype.onFocus = function (event) {
        this.focus = true;
    };
    MultiSelect.prototype.onInputBlur = function (event) {
        this.focus = false;
        this.onBlur.emit({ originalEvent: event });
        this.onModelTouched();
    };
    MultiSelect.prototype.updateLabel = function () {
        if (this.value && this.value.length && this.displaySelectedLabel) {
            var label = '';
            for (var i = 0; i < this.value.length; i++) {
                if (i != 0) {
                    label = label + ', ';
                }
                label = label + this.findLabelByValue(this.value[i]);
            }
            if (this.value.length <= this.maxSelectedLabels) {
                this.valuesAsString = label;
            }
            else {
                var pattern = /{(.*?)}/, newSelectedItemsLabel = this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.value.length + '');
                this.valuesAsString = newSelectedItemsLabel;
            }
        }
        else {
            this.valuesAsString = this.defaultLabel;
        }
    };
    MultiSelect.prototype.findLabelByValue = function (val) {
        var label = null;
        for (var i = 0; i < this.options.length; i++) {
            var option = this.options[i];
            if (option.value == val) {
                label = option.label;
                break;
            }
        }
        return label;
    };
    MultiSelect.prototype.onFilter = function (event) {
        this.filterValue = event.target.value.trim().toLowerCase();
        this.visibleOptions = [];
        for (var i = 0; i < this.options.length; i++) {
            var option = this.options[i];
            if (option.label.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
                this.visibleOptions.push(option);
            }
        }
        this.filtered = true;
    };
    MultiSelect.prototype.isItemVisible = function (option) {
        if (this.filterValue && this.filterValue.trim().length) {
            for (var i = 0; i < this.visibleOptions.length; i++) {
                if (this.visibleOptions[i].value == option.value) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    };
    MultiSelect.prototype.getVisibleOptions = function () {
        if (this.filterValue && this.filterValue.trim().length) {
            var items = [];
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.label.toLowerCase().includes(this.filterValue.toLowerCase())) {
                    items.push(option);
                }
            }
            return items;
        }
        else {
            return this.options;
        }
    };
    MultiSelect.prototype.ngOnDestroy = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
        if (this.appendTo) {
            this.container.appendChild(this.panel);
        }
    };
    return MultiSelect;
}());
__decorate([
    core_1.Input()
], MultiSelect.prototype, "options", void 0);
__decorate([
    core_1.Output()
], MultiSelect.prototype, "onChange", void 0);
__decorate([
    core_1.Output()
], MultiSelect.prototype, "onBlur", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "scrollHeight", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "defaultLabel", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "style", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "inputId", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "overlayVisible", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "tabindex", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "appendTo", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "dataKey", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "displaySelectedLabel", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "maxSelectedLabels", void 0);
__decorate([
    core_1.Input()
], MultiSelect.prototype, "selectedItemsLabel", void 0);
__decorate([
    core_1.ViewChild('container')
], MultiSelect.prototype, "containerViewChild", void 0);
__decorate([
    core_1.ViewChild('panel')
], MultiSelect.prototype, "panelViewChild", void 0);
exports.MultiSelect = MultiSelect;
var MultiSelectModule = (function () {
    function MultiSelectModule() {
    }
    return MultiSelectModule;
}());
exports.MultiSelectModule = MultiSelectModule;

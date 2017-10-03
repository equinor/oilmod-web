"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Header = (function () {
    function Header() {
    }
    return Header;
}());
exports.Header = Header;
var Footer = (function () {
    function Footer() {
    }
    return Footer;
}());
exports.Footer = Footer;
var PrimeTemplate = (function () {
    function PrimeTemplate(template) {
        this.template = template;
    }
    PrimeTemplate.prototype.getType = function () {
        if (this.type) {
            console.log('Defining a pTemplate with type property is deprecated use pTemplate="type" instead.');
            return this.type;
        }
        else {
            return this.name;
        }
    };
    return PrimeTemplate;
}());
__decorate([
    core_1.Input()
], PrimeTemplate.prototype, "type", void 0);
__decorate([
    core_1.Input('pTemplate')
], PrimeTemplate.prototype, "name", void 0);
exports.PrimeTemplate = PrimeTemplate;
var TemplateWrapper = (function () {
    function TemplateWrapper(viewContainer) {
        this.viewContainer = viewContainer;
    }
    TemplateWrapper.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, {
            '\$implicit': this.item,
            'index': this.index
        });
    };
    TemplateWrapper.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return TemplateWrapper;
}());
__decorate([
    core_1.Input()
], TemplateWrapper.prototype, "item", void 0);
__decorate([
    core_1.Input()
], TemplateWrapper.prototype, "index", void 0);
__decorate([
    core_1.Input('pTemplateWrapper')
], TemplateWrapper.prototype, "templateRef", void 0);
exports.TemplateWrapper = TemplateWrapper;
var Column = (function () {
    function Column() {
        this.filterType = 'text';
        this.sortFunction = new core_1.EventEmitter();
    }
    Column.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'header':
                    _this.headerTemplate = item.template;
                    break;
                case 'body':
                    _this.bodyTemplate = item.template;
                    break;
                case 'footer':
                    _this.footerTemplate = item.template;
                    break;
                case 'filter':
                    _this.filterTemplate = item.template;
                    break;
                case 'editor':
                    _this.editorTemplate = item.template;
                    break;
                default:
                    _this.bodyTemplate = item.template;
                    break;
            }
        });
    };
    return Column;
}());
__decorate([
    core_1.Input()
], Column.prototype, "field", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "sortField", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "header", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "footer", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "sortable", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "editable", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "filter", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "filterMatchMode", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "filterType", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "rowspan", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "colspan", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "hidden", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "expander", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "selectionMode", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "filterPlaceholder", void 0);
__decorate([
    core_1.Input()
], Column.prototype, "frozen", void 0);
__decorate([
    core_1.Output()
], Column.prototype, "sortFunction", void 0);
__decorate([
    core_1.ContentChildren(PrimeTemplate)
], Column.prototype, "templates", void 0);
__decorate([
    core_1.ContentChild(core_1.TemplateRef)
], Column.prototype, "template", void 0);
exports.Column = Column;
var Row = (function () {
    function Row() {
    }
    return Row;
}());
__decorate([
    core_1.ContentChildren(Column)
], Row.prototype, "columns", void 0);
exports.Row = Row;
var HeaderColumnGroup = (function () {
    function HeaderColumnGroup() {
    }
    return HeaderColumnGroup;
}());
__decorate([
    core_1.ContentChildren(Row)
], HeaderColumnGroup.prototype, "rows", void 0);
exports.HeaderColumnGroup = HeaderColumnGroup;
var FooterColumnGroup = (function () {
    function FooterColumnGroup() {
    }
    return FooterColumnGroup;
}());
__decorate([
    core_1.ContentChildren(Row)
], FooterColumnGroup.prototype, "rows", void 0);
exports.FooterColumnGroup = FooterColumnGroup;
var ColumnBodyTemplateLoader = (function () {
    function ColumnBodyTemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ColumnBodyTemplateLoader.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.column.bodyTemplate, {
            '\$implicit': this.column,
            'rowData': this.rowData,
            'rowIndex': this.rowIndex
        });
    };
    ColumnBodyTemplateLoader.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return ColumnBodyTemplateLoader;
}());
__decorate([
    core_1.Input()
], ColumnBodyTemplateLoader.prototype, "column", void 0);
__decorate([
    core_1.Input()
], ColumnBodyTemplateLoader.prototype, "rowData", void 0);
__decorate([
    core_1.Input()
], ColumnBodyTemplateLoader.prototype, "rowIndex", void 0);
exports.ColumnBodyTemplateLoader = ColumnBodyTemplateLoader;
var ColumnHeaderTemplateLoader = (function () {
    function ColumnHeaderTemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ColumnHeaderTemplateLoader.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
            '\$implicit': this.column
        });
    };
    ColumnHeaderTemplateLoader.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return ColumnHeaderTemplateLoader;
}());
__decorate([
    core_1.Input()
], ColumnHeaderTemplateLoader.prototype, "column", void 0);
exports.ColumnHeaderTemplateLoader = ColumnHeaderTemplateLoader;
var ColumnFooterTemplateLoader = (function () {
    function ColumnFooterTemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ColumnFooterTemplateLoader.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.column.footerTemplate, {
            '\$implicit': this.column
        });
    };
    ColumnFooterTemplateLoader.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return ColumnFooterTemplateLoader;
}());
__decorate([
    core_1.Input()
], ColumnFooterTemplateLoader.prototype, "column", void 0);
exports.ColumnFooterTemplateLoader = ColumnFooterTemplateLoader;
var ColumnFilterTemplateLoader = (function () {
    function ColumnFilterTemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ColumnFilterTemplateLoader.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.column.filterTemplate, {
            '\$implicit': this.column
        });
    };
    ColumnFilterTemplateLoader.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return ColumnFilterTemplateLoader;
}());
__decorate([
    core_1.Input()
], ColumnFilterTemplateLoader.prototype, "column", void 0);
exports.ColumnFilterTemplateLoader = ColumnFilterTemplateLoader;
var ColumnEditorTemplateLoader = (function () {
    function ColumnEditorTemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ColumnEditorTemplateLoader.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.column.editorTemplate, {
            '\$implicit': this.column,
            'rowData': this.rowData,
            'rowIndex': this.rowIndex
        });
    };
    ColumnEditorTemplateLoader.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return ColumnEditorTemplateLoader;
}());
__decorate([
    core_1.Input()
], ColumnEditorTemplateLoader.prototype, "column", void 0);
__decorate([
    core_1.Input()
], ColumnEditorTemplateLoader.prototype, "rowData", void 0);
__decorate([
    core_1.Input()
], ColumnEditorTemplateLoader.prototype, "rowIndex", void 0);
exports.ColumnEditorTemplateLoader = ColumnEditorTemplateLoader;
var TemplateLoader = (function () {
    function TemplateLoader(viewContainer) {
        this.viewContainer = viewContainer;
    }
    TemplateLoader.prototype.ngOnInit = function () {
        if (this.template) {
            this.view = this.viewContainer.createEmbeddedView(this.template, {
                '\$implicit': this.data
            });
        }
    };
    TemplateLoader.prototype.ngOnDestroy = function () {
        if (this.view)
            this.view.destroy();
    };
    return TemplateLoader;
}());
__decorate([
    core_1.Input()
], TemplateLoader.prototype, "template", void 0);
__decorate([
    core_1.Input()
], TemplateLoader.prototype, "data", void 0);
exports.TemplateLoader = TemplateLoader;
var SharedModule = (function () {
    function SharedModule() {
    }
    return SharedModule;
}());
exports.SharedModule = SharedModule;

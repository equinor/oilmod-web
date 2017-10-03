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
var shared_1 = require("../common/shared");
var Dialog = (function () {
    function Dialog(el, domHandler, renderer) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.draggable = true;
        this.resizable = true;
        this.minWidth = 150;
        this.minHeight = 150;
        this.closeOnEscape = true;
        this.closable = true;
        this.showHeader = true;
        this.onShow = new core_1.EventEmitter();
        this.onHide = new core_1.EventEmitter();
        this.visibleChange = new core_1.EventEmitter();
    }
    Object.defineProperty(Dialog.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (val) {
            this._visible = val;
            if (this.container) {
                if (this._visible)
                    this.show();
                else
                    this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Dialog.prototype.show = function () {
        this.onShow.emit({});
        this.center();
        this.container.style.zIndex = String(++domhandler_1.DomHandler.zindex);
        if (this.modal) {
            this.enableModality();
        }
    };
    Dialog.prototype.hide = function () {
        this.onHide.emit({});
        this.unbindMaskClickListener();
        if (this.modal) {
            this.disableModality();
        }
    };
    Dialog.prototype.close = function (event) {
        this.hide();
        this.visibleChange.emit(false);
        event.preventDefault();
    };
    Dialog.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.container = this.containerViewChild.nativeElement;
        this.contentContainer = this.contentViewChild.nativeElement;
        if (this.draggable) {
            this.documentDragListener = this.renderer.listenGlobal('document', 'mousemove', function (event) {
                _this.onDrag(event);
            });
        }
        if (this.resizable) {
            this.documentResizeListener = this.renderer.listenGlobal('document', 'mousemove', function (event) {
                _this.onResize(event);
            });
            this.documentResizeEndListener = this.renderer.listenGlobal('document', 'mouseup', function (event) {
                if (_this.resizing) {
                    _this.resizing = false;
                }
            });
        }
        if (this.responsive) {
            this.documentResponsiveListener = this.renderer.listenGlobal('window', 'resize', function (event) {
                _this.center();
            });
        }
        if (this.closeOnEscape && this.closable) {
            this.documentEscapeListener = this.renderer.listenGlobal('document', 'keydown', function (event) {
                if (event.which == 27) {
                    if (parseInt(_this.container.style.zIndex) == domhandler_1.DomHandler.zindex) {
                        _this.close(event);
                    }
                }
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }
        if (this.visible) {
            this.show();
        }
    };
    Dialog.prototype.center = function () {
        var elementWidth = this.domHandler.getOuterWidth(this.container);
        var elementHeight = this.domHandler.getOuterHeight(this.container);
        if (elementWidth == 0 && elementHeight == 0) {
            this.container.style.visibility = 'hidden';
            this.container.style.display = 'block';
            elementWidth = this.domHandler.getOuterWidth(this.container);
            elementHeight = this.domHandler.getOuterHeight(this.container);
            this.container.style.display = 'none';
            this.container.style.visibility = 'visible';
        }
        var viewport = this.domHandler.getViewport();
        var x = Math.max((viewport.width - elementWidth) / 2, 0);
        var y = Math.max((viewport.height - elementHeight) / 2, 0);
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
    };
    Dialog.prototype.enableModality = function () {
        var _this = this;
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.container.style.zIndex) - 1);
            this.domHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
            if (this.closable && this.dismissableMask) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', function (event) {
                    _this.close(event);
                });
            }
            document.body.appendChild(this.mask);
        }
    };
    Dialog.prototype.disableModality = function () {
        if (this.mask) {
            document.body.removeChild(this.mask);
            this.mask = null;
        }
    };
    Dialog.prototype.unbindMaskClickListener = function () {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    };
    Dialog.prototype.moveOnTop = function () {
        this.container.style.zIndex = String(++domhandler_1.DomHandler.zindex);
    };
    Dialog.prototype.initDrag = function (event) {
        if (this.draggable) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    Dialog.prototype.onDrag = function (event) {
        if (this.dragging) {
            var deltaX = event.pageX - this.lastPageX;
            var deltaY = event.pageY - this.lastPageY;
            var leftPos = parseInt(this.container.style.left);
            var topPos = parseInt(this.container.style.top);
            this.container.style.left = leftPos + deltaX + 'px';
            this.container.style.top = topPos + deltaY + 'px';
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    Dialog.prototype.endDrag = function (event) {
        if (this.draggable) {
            this.dragging = false;
        }
    };
    Dialog.prototype.initResize = function (event) {
        if (this.resizable) {
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    Dialog.prototype.onResize = function (event) {
        if (this.resizing) {
            var deltaX = event.pageX - this.lastPageX;
            var deltaY = event.pageY - this.lastPageY;
            var containerWidth = this.domHandler.getWidth(this.container);
            var contentHeight = this.domHandler.getOuterHeight(this.contentContainer);
            var newWidth = containerWidth + deltaX;
            var newHeight = contentHeight + deltaY;
            if (newWidth > this.minWidth)
                this.container.style.width = newWidth + 'px';
            if (newHeight > this.minHeight)
                this.contentContainer.style.height = newHeight + 'px';
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    Dialog.prototype.ngOnDestroy = function () {
        this.disableModality();
        if (this.documentDragListener) {
            this.documentDragListener();
        }
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
        }
        if (this.documentResponsiveListener) {
            this.documentResponsiveListener();
        }
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
        this.unbindMaskClickListener();
    };
    return Dialog;
}());
__decorate([
    core_1.Input()
], Dialog.prototype, "header", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "draggable", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "resizable", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "minWidth", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "minHeight", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "width", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "height", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "contentStyle", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "modal", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "closeOnEscape", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "dismissableMask", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "rtl", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "closable", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "responsive", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "appendTo", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "showHeader", void 0);
__decorate([
    core_1.ContentChild(shared_1.Header)
], Dialog.prototype, "headerFacet", void 0);
__decorate([
    core_1.ViewChild('container')
], Dialog.prototype, "containerViewChild", void 0);
__decorate([
    core_1.ViewChild('content')
], Dialog.prototype, "contentViewChild", void 0);
__decorate([
    core_1.Output()
], Dialog.prototype, "onShow", void 0);
__decorate([
    core_1.Output()
], Dialog.prototype, "onHide", void 0);
__decorate([
    core_1.Output()
], Dialog.prototype, "visibleChange", void 0);
__decorate([
    core_1.Input()
], Dialog.prototype, "visible", null);
exports.Dialog = Dialog;
var DialogModule = (function () {
    function DialogModule() {
    }
    return DialogModule;
}());
exports.DialogModule = DialogModule;

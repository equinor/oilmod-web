"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../dom/domhandler");
var ContextMenuSub = (function () {
    function ContextMenuSub(domHandler, contextMenu) {
        this.domHandler = domHandler;
        this.contextMenu = contextMenu;
    }
    ContextMenuSub.prototype.onItemMouseEnter = function (event, item, menuitem) {
        if (menuitem.disabled) {
            return;
        }
        this.activeItem = item;
        var nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            var sublist = nextElement.children[0];
            sublist.style.zIndex = ++domhandler_1.DomHandler.zindex;
            this.position(sublist, item);
        }
    };
    ContextMenuSub.prototype.onItemMouseLeave = function (event, link) {
        this.activeItem = null;
    };
    ContextMenuSub.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            if (!item.eventEmitter) {
                item.eventEmitter = new core_1.EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }
    };
    ContextMenuSub.prototype.listClick = function (event) {
        this.activeItem = null;
    };
    ContextMenuSub.prototype.position = function (sublist, item) {
        this.containerLeft = this.domHandler.getOffset(item.parentElement);
        var viewport = this.domHandler.getViewport();
        var sublistWidth = sublist.offsetParent ? sublist.offsetWidth : this.domHandler.getHiddenElementOuterWidth(sublist);
        var itemOuterWidth = this.domHandler.getOuterWidth(item.children[0]);
        sublist.style.top = '0px';
        if ((parseInt(this.containerLeft.left) + itemOuterWidth + sublistWidth) > (viewport.width - this.calculateScrollbarWidth())) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    };
    ContextMenuSub.prototype.calculateScrollbarWidth = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'ui-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    };
    return ContextMenuSub;
}());
__decorate([
    core_1.Input()
], ContextMenuSub.prototype, "item", void 0);
__decorate([
    core_1.Input()
], ContextMenuSub.prototype, "root", void 0);
ContextMenuSub = __decorate([
    __param(1, core_1.Inject(core_1.forwardRef(function () { return ContextMenu; })))
], ContextMenuSub);
exports.ContextMenuSub = ContextMenuSub;
var ContextMenu = (function () {
    function ContextMenu(el, domHandler, renderer) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
    }
    ContextMenu.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.container = this.containerViewChild.nativeElement;
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', function () {
            _this.hide();
        });
        if (this.global) {
            this.rightClickListener = this.renderer.listenGlobal('document', 'contextmenu', function (event) {
                _this.show(event);
                event.preventDefault();
            });
        }
        else if (this.target) {
            this.rightClickListener = this.renderer.listen(this.target, 'contextmenu', function (event) {
                _this.show(event);
                event.preventDefault();
                event.stopPropagation();
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body') {
                document.body.appendChild(this.container);
            }
            else {
                this.domHandler.appendChild(this.container, this.appendTo);
            }
        }
    };
    ContextMenu.prototype.show = function (event) {
        this.position(event);
        this.visible = true;
        this.domHandler.fadeIn(this.container, 250);
        if (event) {
            event.preventDefault();
        }
    };
    ContextMenu.prototype.hide = function () {
        this.visible = false;
    };
    ContextMenu.prototype.toggle = function (event) {
        if (this.visible) {
            this.hide();
        }
        else {
            this.show(event);
        }
    };
    ContextMenu.prototype.position = function (event) {
        if (event) {
            var left = event.pageX;
            var top_1 = event.pageY;
            var width = this.container.offsetParent ? this.container.offsetWidth : this.domHandler.getHiddenElementOuterWidth(this.container);
            var height = this.container.offsetParent ? this.container.offsetHeight : this.domHandler.getHiddenElementOuterHeight(this.container);
            var viewport = this.domHandler.getViewport();
            //flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }
            //flip
            if (top_1 + height - document.body.scrollTop > viewport.height) {
                top_1 -= height;
            }
            //fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }
            //fit
            if (top_1 < document.body.scrollTop) {
                top_1 = document.body.scrollTop;
            }
            this.container.style.left = left + 'px';
            this.container.style.top = top_1 + 'px';
        }
    };
    ContextMenu.prototype.unsubscribe = function (item) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }
        if (item.items) {
            for (var _i = 0, _a = item.items; _i < _a.length; _i++) {
                var childItem = _a[_i];
                this.unsubscribe(childItem);
            }
        }
    };
    ContextMenu.prototype.ngOnDestroy = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
        if (this.rightClickListener) {
            this.rightClickListener();
        }
        if (this.model) {
            for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
                var item = _a[_i];
                this.unsubscribe(item);
            }
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    };
    return ContextMenu;
}());
__decorate([
    core_1.Input()
], ContextMenu.prototype, "model", void 0);
__decorate([
    core_1.Input()
], ContextMenu.prototype, "global", void 0);
__decorate([
    core_1.Input()
], ContextMenu.prototype, "target", void 0);
__decorate([
    core_1.Input()
], ContextMenu.prototype, "style", void 0);
__decorate([
    core_1.Input()
], ContextMenu.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], ContextMenu.prototype, "appendTo", void 0);
__decorate([
    core_1.ViewChild('container')
], ContextMenu.prototype, "containerViewChild", void 0);
exports.ContextMenu = ContextMenu;

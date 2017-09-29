"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TabViewNav = (function () {
    function TabViewNav() {
        this.orientation = 'top';
        this.onTabClick = new core_1.EventEmitter();
        this.onTabCloseClick = new core_1.EventEmitter();
    }
    TabViewNav.prototype.getDefaultHeaderClass = function (tab) {
        var styleClass = 'ui-state-default ui-corner-' + this.orientation;
        if (tab.headerStyleClass) {
            styleClass = styleClass + " " + tab.headerStyleClass;
        }
        return styleClass;
    };
    TabViewNav.prototype.clickTab = function (event, tab) {
        this.onTabClick.emit({
            originalEvent: event,
            tab: tab
        });
    };
    TabViewNav.prototype.clickClose = function (event, tab) {
        this.onTabCloseClick.emit({
            originalEvent: event,
            tab: tab
        });
    };
    return TabViewNav;
}());
__decorate([
    core_1.Input()
], TabViewNav.prototype, "tabs", void 0);
__decorate([
    core_1.Input()
], TabViewNav.prototype, "orientation", void 0);
__decorate([
    core_1.Output()
], TabViewNav.prototype, "onTabClick", void 0);
__decorate([
    core_1.Output()
], TabViewNav.prototype, "onTabCloseClick", void 0);
exports.TabViewNav = TabViewNav;
var TabPanel = (function () {
    function TabPanel() {
    }
    return TabPanel;
}());
__decorate([
    core_1.Input()
], TabPanel.prototype, "header", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "selected", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "closable", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "headerStyle", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "headerStyleClass", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "leftIcon", void 0);
__decorate([
    core_1.Input()
], TabPanel.prototype, "rightIcon", void 0);
exports.TabPanel = TabPanel;
var TabView = (function () {
    function TabView(el) {
        this.el = el;
        this.orientation = 'top';
        this.onChange = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
    }
    TabView.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.initTabs();
        this.tabPanels.changes.subscribe(function (_) {
            _this.initTabs();
        });
    };
    TabView.prototype.initTabs = function () {
        this.tabs = this.tabPanels.toArray();
        for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            tab.lazy = this.lazy;
        }
        var selectedTab = this.findSelectedTab();
        if (!selectedTab && this.tabs.length) {
            if (this.activeIndex != null && this.tabs.length > this.activeIndex)
                this.tabs[this.activeIndex].selected = true;
            else
                this.tabs[0].selected = true;
        }
    };
    TabView.prototype.open = function (event, tab) {
        if (tab.disabled) {
            event.preventDefault();
            return;
        }
        if (!tab.selected) {
            var selectedTab = this.findSelectedTab();
            if (selectedTab) {
                selectedTab.selected = false;
            }
            tab.selected = true;
            this.onChange.emit({ originalEvent: event, index: this.findTabIndex(tab) });
        }
        event.preventDefault();
    };
    TabView.prototype.close = function (event, tab) {
        var _this = this;
        if (this.controlClose) {
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab),
                close: function () {
                    _this.closeTab(tab);
                }
            });
        }
        else {
            this.closeTab(tab);
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab)
            });
        }
        event.stopPropagation();
    };
    TabView.prototype.closeTab = function (tab) {
        if (tab.selected) {
            tab.selected = false;
            for (var i = 0; i < this.tabs.length; i++) {
                var tabPanel = this.tabs[i];
                if (!tabPanel.closed && !tab.disabled) {
                    tabPanel.selected = true;
                    break;
                }
            }
        }
        tab.closed = true;
    };
    TabView.prototype.findSelectedTab = function () {
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].selected) {
                return this.tabs[i];
            }
        }
        return null;
    };
    TabView.prototype.findTabIndex = function (tab) {
        var index = -1;
        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i] == tab) {
                index = i;
                break;
            }
        }
        return index;
    };
    TabView.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    Object.defineProperty(TabView.prototype, "activeIndex", {
        get: function () {
            return this._activeIndex;
        },
        set: function (val) {
            this._activeIndex = val;
            if (this.tabs && this.tabs.length && this._activeIndex != null) {
                this.findSelectedTab().selected = false;
                this.tabs[this._activeIndex].selected = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    return TabView;
}());
__decorate([
    core_1.Input()
], TabView.prototype, "orientation", void 0);
__decorate([
    core_1.Input()
], TabView.prototype, "style", void 0);
__decorate([
    core_1.Input()
], TabView.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], TabView.prototype, "controlClose", void 0);
__decorate([
    core_1.Input()
], TabView.prototype, "lazy", void 0);
__decorate([
    core_1.ContentChildren(TabPanel)
], TabView.prototype, "tabPanels", void 0);
__decorate([
    core_1.Output()
], TabView.prototype, "onChange", void 0);
__decorate([
    core_1.Output()
], TabView.prototype, "onClose", void 0);
__decorate([
    core_1.Input()
], TabView.prototype, "activeIndex", null);
exports.TabView = TabView;
var TabViewModule = (function () {
    function TabViewModule() {
    }
    return TabViewModule;
}());
exports.TabViewModule = TabViewModule;

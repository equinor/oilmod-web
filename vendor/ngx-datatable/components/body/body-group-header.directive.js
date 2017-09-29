"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var body_group_header_template_directive_1 = require("./body-group-header-template.directive");
var DatatableGroupHeaderDirective = (function () {
    function DatatableGroupHeaderDirective() {
        /**
         * The detail row height is required especially
         * when virtual scroll is enabled.
         */
        this.rowHeight = 0;
        /**
         * Group visbility was toggled.
         */
        this.toggle = new core_1.EventEmitter();
    }
    /**
     * Toggle the expansion of a group
     */
    DatatableGroupHeaderDirective.prototype.toggleExpandGroup = function (group) {
        this.toggle.emit({
            type: 'group',
            value: group
        });
    };
    /**
     * API method to expand all groups.
     */
    DatatableGroupHeaderDirective.prototype.expandAllGroups = function () {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    };
    /**
     * API method to collapse all groups.
     */
    DatatableGroupHeaderDirective.prototype.collapseAllGroups = function () {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    };
    return DatatableGroupHeaderDirective;
}());
__decorate([
    core_1.Input()
], DatatableGroupHeaderDirective.prototype, "rowHeight", void 0);
__decorate([
    core_1.Input(),
    core_1.ContentChild(body_group_header_template_directive_1.DatatableGroupHeaderTemplateDirective, { read: core_1.TemplateRef })
], DatatableGroupHeaderDirective.prototype, "template", void 0);
__decorate([
    core_1.Output()
], DatatableGroupHeaderDirective.prototype, "toggle", void 0);
DatatableGroupHeaderDirective = __decorate([
    core_1.Directive({ selector: 'ngx-datatable-group-header' })
], DatatableGroupHeaderDirective);
exports.DatatableGroupHeaderDirective = DatatableGroupHeaderDirective;

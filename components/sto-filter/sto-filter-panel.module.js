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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var core_2 = require("@angular/material/core");
var Subject_1 = require("rxjs/Subject");
var accordion_item_1 = require("./accordion-item");
// Boilerplate for applying mixins to MdExpansionPanel.
/** @docs-private */
var MdExpansionPanelBase = (function (_super) {
    __extends(MdExpansionPanelBase, _super);
    function MdExpansionPanelBase(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        return _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
    }
    return MdExpansionPanelBase;
}(accordion_item_1.AccordionItem));
exports.MdExpansionPanelBase = MdExpansionPanelBase;
exports._MdExpansionPanelMixinBase = core_2.mixinDisabled(MdExpansionPanelBase);
/** Time and timing curve for expansion panel animations. */
exports.EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * <md-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CdkAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
var StoFilterPanelComponent = (function (_super) {
    __extends(StoFilterPanelComponent, _super);
    function StoFilterPanelComponent(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        /** Whether the toggle indicator should be hidden. */
        _this.hideToggle = false;
        /** Stream that emits for changes in `@Input` properties. */
        _this._inputChanges = new Subject_1.Subject();
        _this.accordion = accordion;
        return _this;
    }
    /** Whether the expansion indicator should be hidden. */
    StoFilterPanelComponent.prototype._getHideToggle = function () {
        if (this.accordion) {
            return this.accordion.hideToggle;
        }
        return this.hideToggle;
    };
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    StoFilterPanelComponent.prototype._hasSpacing = function () {
        if (this.accordion) {
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    };
    /** Gets the expanded state string. */
    StoFilterPanelComponent.prototype._getExpandedState = function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    StoFilterPanelComponent.prototype.ngOnChanges = function (changes) {
        this._inputChanges.next(changes);
    };
    StoFilterPanelComponent.prototype.ngOnDestroy = function () {
        this._inputChanges.complete();
    };
    return StoFilterPanelComponent;
}(exports._MdExpansionPanelMixinBase));
__decorate([
    core_1.Input()
], StoFilterPanelComponent.prototype, "hideToggle", void 0);
StoFilterPanelComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        styleUrls: ['sto-filter-panel.component.scss'],
        selector: 'sto-expansion-panel, mat-expansion-panel',
        templateUrl: './expansion-panel.html',
        encapsulation: core_1.ViewEncapsulation.None,
        preserveWhitespaces: false,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        inputs: ['disabled', 'expanded'],
        host: {
            'class': 'mat-expansion-panel',
            '[class.mat-expanded]': 'expanded',
            '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
        },
        providers: [
            { provide: accordion_item_1.AccordionItem, useExisting: core_1.forwardRef(function () { return MdExpansionPanel; }) }
        ],
        animations: [
            animations_1.trigger('bodyExpansion', [
                animations_1.state('collapsed', animations_1.style({ height: '0px', visibility: 'hidden' })),
                animations_1.state('expanded', animations_1.style({ height: '*', visibility: 'visible' })),
                animations_1.transition('expanded <=> collapsed', animations_1.animate(exports.EXPANSION_PANEL_ANIMATION_TIMING)),
            ]),
        ],
    }),
    __param(0, core_1.Optional()), __param(0, core_1.Host())
], StoFilterPanelComponent);
exports.StoFilterPanelComponent = StoFilterPanelComponent;

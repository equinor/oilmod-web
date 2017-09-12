import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    forwardRef,
    NgModule,
    QueryList,
    Renderer
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Dropdown } from '../../vendor/primeface/components/dropdown/dropdown';
import { StoSharedModule, StoTemplate } from '../sto-shared/sto-shared';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';

export const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoDropdownComponent),
    multi: true
};

@Component({
    selector: 'sto-dropdown',
    templateUrl: 'sto-dropdown.component.html',
    styleUrls: ['sto-dropdown.component.scss'],
    animations: [
        trigger('panelState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            // transition('visible <=> hidden', animate('400ms ease')) // Disabled for now. Choppy
        ])
    ],
    providers: [DomHandler, ObjectUtils, DROPDOWN_VALUE_ACCESSOR]
})
export class StoDropdownComponent extends Dropdown {

    @ContentChildren(StoTemplate) templates: QueryList<any>;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, protected cd: ChangeDetectorRef, public objectUtils: ObjectUtils) {
        super(el, domHandler, renderer, cd, objectUtils);
    }

}

@NgModule({
    imports: [CommonModule, StoSharedModule],
    exports: [StoDropdownComponent, StoSharedModule],
    declarations: [StoDropdownComponent]
})
export class StoDropdownModule {
}

import { Component, ContentChildren, ElementRef, forwardRef, NgModule, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';
import { Listbox } from '../../vendor/primeface/components/listbox/listbox';
import { StoSharedModule, StoTemplate } from '../sto-shared/sto-shared';

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoListboxComponent),
    multi: true
};

@Component({
    selector: 'sto-listbox',
    templateUrl: 'sto-listbox.component.html',
    styleUrls: ['sto-listbox.component.scss'],
    providers: [DomHandler, ObjectUtils, LISTBOX_VALUE_ACCESSOR]
})
export class StoListboxComponent extends Listbox {
    @ContentChildren(StoTemplate) templates: QueryList<any>;
    constructor(public el: ElementRef, public domHandler: DomHandler, public objectUtils: ObjectUtils) {
        super(el, domHandler, objectUtils);
    }

}

@NgModule({
    imports: [CommonModule, StoSharedModule],
    exports: [StoListboxComponent, StoSharedModule],
    declarations: [StoListboxComponent]
})
export class StoListboxModule {
}

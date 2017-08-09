import { Component, ElementRef, forwardRef, IterableDiffers, NgModule, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelect } from '../../vendor/primeface/components/multiselect/multiselect';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';

export const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoMultiSelectComponent),
    multi: true
};

@Component({
    selector: 'sto-multiSelect',
    templateUrl: 'sto-multiselect.component.html',
    styleUrls: ['sto-multiselect.component.scss'],
    providers: [DomHandler, ObjectUtils, MULTISELECT_VALUE_ACCESSOR]
})
export class StoMultiSelectComponent extends MultiSelect {
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, differs: IterableDiffers, public objectUtils: ObjectUtils) {
        super(el, domHandler, renderer, differs, objectUtils);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [StoMultiSelectComponent],
    declarations: [StoMultiSelectComponent]
})
export class StoMultiSelectModule {
}

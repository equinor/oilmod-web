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
import { CommonModule } from '@angular/common';


import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoComplete, AutoCompleteModule } from 'ngx-stoui/vendor/primeface/components/autocomplete/autocomplete';
import { StoSharedModule, StoTemplate } from '../sto-shared/sto-shared';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { DomHandler } from 'ngx-stoui/vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';
import { InputTextModule } from '../../vendor/primeface/components/inputtext/inputtext';
import { SharedModule } from '../../vendor/primeface/components/common/shared';

export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoAutoCompleteComponent),
    multi: true
};

@Component({
    selector: 'sto-autoComplete',
    templateUrl: 'sto-autocomplete.component.html',
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [DomHandler, ObjectUtils, AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class StoAutoCompleteComponent extends AutoComplete {
    @ContentChildren(StoTemplate) templates: QueryList<any>;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public objectUtils: ObjectUtils, public cd: ChangeDetectorRef) {
        super(el, domHandler, renderer, objectUtils, cd);
    }

}

@NgModule({
    imports: [CommonModule, InputTextModule, StoButtonModule, StoSharedModule, SharedModule, AutoCompleteModule],
    exports: [StoAutoCompleteComponent, StoSharedModule],
    declarations: [StoAutoCompleteComponent]
})
export class StoAutoCompleteModule {
}
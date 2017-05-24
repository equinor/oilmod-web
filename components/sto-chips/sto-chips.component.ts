import { Component, ContentChildren, ElementRef, forwardRef, NgModule, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { StoSharedModule, StoTemplate } from '../sto-shared/sto-shared';
import { StoInputTextModule } from '../sto-inputtext/sto-inputtext.directive';
import { Chips } from '../../vendor/primeface/components/chips/chips';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';

export const CHIPS_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoChipsComponent),
    multi: true
};

@Component({
    selector: 'sto-chips',
    templateUrl: 'sto-chips.component.html',
    styleUrls : ['sto-chips.component.scss'],
    providers: [DomHandler, CHIPS_VALUE_ACCESSOR]
})
export class StoChipsComponent extends Chips {


    @ContentChildren(StoTemplate) templates: QueryList<any>;

    constructor(public el: ElementRef, public domHandler: DomHandler) {
        super(el, domHandler);
    }
}

@NgModule({
    imports: [CommonModule, StoInputTextModule, StoSharedModule],
    exports: [StoChipsComponent, StoInputTextModule, StoSharedModule],
    declarations: [StoChipsComponent]
})
export class StoChipsModule {
}

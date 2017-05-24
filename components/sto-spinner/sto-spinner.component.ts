import { Component, ElementRef, EventEmitter, forwardRef, Input, NgModule, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Spinner } from '../../vendor/primeface/components/spinner/spinner';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { StoInputTextModule } from '../sto-inputtext/sto-inputtext.directive';

export const SPINNER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoSpinnerComponent),
    multi: true
};

@Component({
    selector: 'sto-spinner',
    templateUrl: 'sto-spinner.component.html',
    styleUrls : ['sto.spinner.component.scss'],
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [DomHandler, SPINNER_VALUE_ACCESSOR],
})
export class StoSpinnerComponent extends Spinner {
}


@NgModule({
    imports: [CommonModule, StoInputTextModule],
    exports: [StoSpinnerComponent],
    declarations: [StoSpinnerComponent]
})
export class StoSpinnerModule {
}

import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButton } from '../../vendor/primeface/components/radiobutton/radiobutton';

export const RADIO_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoRadioButtonComponent),
    multi: true
};

@Component({
    selector: 'sto-radioButton',
    templateUrl: 'sto-radiobutton.component.html',
    styleUrls : ['sto-radiobutton.component.scss'],
    providers: [RADIO_VALUE_ACCESSOR]
})
export class StoRadioButtonComponent extends RadioButton {
}

@NgModule({
    imports: [CommonModule],
    exports: [StoRadioButtonComponent],
    declarations: [StoRadioButtonComponent]
})
export class StoRadioButtonModule {
}
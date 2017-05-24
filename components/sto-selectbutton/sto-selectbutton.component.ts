import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectButton } from '../../vendor/primeface/components/selectbutton/selectbutton';

export const SELECTBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoSelectButtonComponent),
    multi: true
};

@Component({
    selector: 'sto-selectButton',
    templateUrl: 'sto-selectbutton.component.html',
    styleUrls: ['sto-selectbutton.component.scss'],
    providers: [SELECTBUTTON_VALUE_ACCESSOR]
})
export class StoSelectButtonComponent extends SelectButton {
}

@NgModule({
    imports: [CommonModule],
    exports: [StoSelectButtonComponent],
    declarations: [StoSelectButtonComponent]
})
export class StoSelectButtonModule {
}
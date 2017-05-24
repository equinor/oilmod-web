import { Component, forwardRef, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Checkbox } from '../../vendor/primeface/components/checkbox/checkbox';

export const CHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoCheckboxComponent),
    multi: true
};

@Component({
    selector: 'sto-checkbox',
    styleUrls : ['sto-checkbox.component.scss'],
    templateUrl: 'sto-checkbox.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class StoCheckboxComponent extends Checkbox {

}

@NgModule({
    imports: [CommonModule],
    exports: [StoCheckboxComponent],
    declarations: [StoCheckboxComponent]
})
export class StoCheckboxModule {
}
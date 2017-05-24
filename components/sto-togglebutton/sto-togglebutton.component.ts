import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleButton } from '../../vendor/primeface/components/togglebutton/togglebutton';

export const TOGGLEBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoToggleButtonComponent),
    multi: true
};

@Component({
    selector: 'sto-toggleButton',
    templateUrl: 'sto-togglebutton.component.html',
    providers: [TOGGLEBUTTON_VALUE_ACCESSOR]
})
export class StoToggleButtonComponent extends ToggleButton {

}

@NgModule({
    imports: [CommonModule],
    exports: [StoToggleButtonComponent],
    declarations: [StoToggleButtonComponent]
})
export class StoToggleButtonModule {
}
import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { InputSwitch } from '../../vendor/primeface/components/inputswitch/inputswitch';

export const INPUTSWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoInputSwitchComponent),
    multi: true
};

@Component({
    selector: 'sto-inputSwitch',
    templateUrl: 'sto-inputswitch.component.html',
    styleUrls: ['sto-inputswitch.component.scss'],
    providers: [INPUTSWITCH_VALUE_ACCESSOR, DomHandler]
})
export class StoInputSwitchComponent extends InputSwitch {
}

@NgModule({
    imports: [CommonModule],
    exports: [StoInputSwitchComponent],
    declarations: [StoInputSwitchComponent]
})
export class StoInputSwitchModule {
}

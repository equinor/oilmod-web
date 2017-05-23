import { Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputText } from '../../vendor/primeface/components/inputtext/inputtext';

@Directive({
    selector: '[stoInputText]',
    host: {
        '[class.ui-inputtext]': 'true',
        '[class.ui-corner-all]': 'true',
        '[class.ui-state-default]': 'true',
        '[class.ui-widget]': 'true',
        '[class.ui-state-filled]': 'filled'
    }
})
export class StoInputTextDirective extends InputText {


}

@NgModule({
    imports: [CommonModule],
    exports: [StoInputTextDirective],
    declarations: [StoInputTextDirective]
})
export class StoInputTextModule {
}
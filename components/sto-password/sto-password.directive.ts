import { Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { Password } from '../../vendor/primeface/components/password/password';

@Directive({
    selector: '[stoPassword]',
    host: {
        '[class.ui-inputtext]': 'true',
        '[class.ui-corner-all]': 'true',
        '[class.ui-state-default]': 'true',
        '[class.ui-widget]': 'true',
        '[class.ui-state-filled]': 'filled'
    },
    providers: [DomHandler]
})
export class StoPasswordDirective extends Password{
}

@NgModule({
    imports: [CommonModule],
    exports: [StoPasswordDirective],
    declarations: [StoPasswordDirective]
})
export class StoPasswordModule {
}
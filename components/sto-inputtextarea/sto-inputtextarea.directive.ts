import { Directive, ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextarea } from '../../vendor/primeface/components/inputtextarea/inputtextarea';

@Directive({
    selector: '[stoInputTextarea]',
    host: {
        '[class.ui-inputtext]': 'true',
        '[class.ui-corner-all]': 'true',
        '[class.ui-state-default]': 'true',
        '[class.ui-widget]': 'true',
        '[class.ui-state-filled]': 'filled',
        '[attr.rows]': 'rows',
        '[attr.cols]': 'cols'
    }
})
export class StoInputTextareaDirective extends InputTextarea {
    constructor(public el: ElementRef) {
        super(el);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [StoInputTextareaDirective],
    declarations: [StoInputTextareaDirective]
})
export class StoInputTextareaModule {
}
import { CommonModule } from '@angular/common';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { Directive, ElementRef, Input, NgModule } from '@angular/core';
import { Tooltip } from '../../vendor/primeface/components/tooltip/tooltip';


@Directive({
    selector: '[stoTooltip]',
    host: {},
    providers: [DomHandler]
})
export class StoTooltipDirective extends Tooltip {
    constructor(public el: ElementRef, public domHandler: DomHandler) {
        super(el, domHandler);
    }

    @Input('stoTooltip') text: string;
}

@NgModule({
    imports: [CommonModule],
    exports: [StoTooltipDirective],
    declarations: [StoTooltipDirective]
})
export class StoTooltipModule {
}

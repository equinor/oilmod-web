import { CommonModule } from '@angular/common';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { Directive, Input, NgModule } from '@angular/core';
import { Tooltip } from '../../vendor/primeface/components/tooltip/tooltip';


@Directive({
    selector: '[stoTooltip]',
    host: {},
    providers: [DomHandler]
})
export class StoTooltipDirective extends Tooltip {

    @Input('stoTooltip') text: string;
}

@NgModule({
    imports: [CommonModule],
    exports: [StoTooltipDirective],
    declarations: [StoTooltipDirective]
})
export class StoTooltipModule {
}

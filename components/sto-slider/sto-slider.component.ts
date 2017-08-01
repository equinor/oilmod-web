import { Component, forwardRef, NgModule, ElementRef, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Slider } from '../../vendor/primeface/components/slider/slider';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoSliderComponent),
    multi: true
};

@Component({
    selector: 'sto-slider',
    templateUrl: 'sto-slider.component.html',
    styleUrls: ['sto-slider.component.scss'],
    providers: [SLIDER_VALUE_ACCESSOR, DomHandler]
})
export class StoSliderComponent extends Slider {
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
        super(el, domHandler, renderer);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [StoSliderComponent],
    declarations: [StoSliderComponent]
})
export class StoSliderModule {
}
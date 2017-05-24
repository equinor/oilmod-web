/*
 Port of jQuery MaskedInput by DigitalBush as a Native Angular2 Component in Typescript without jQuery
 https://github.com/digitalBush/jquery.maskedinput/

 Copyright (c) 2007-2014 Josh Bush (digitalbush.com)

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */
import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { InputMask } from '../../vendor/primeface/components/inputmask/inputmask';
import { StoInputTextModule } from '../sto-inputtext/sto-inputtext.directive';

export const INPUTMASK_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoInputMaskComponent),
    multi: true
};

@Component({
    selector: 'sto-inputMask',
    templateUrl: 'sto-inputmask.component.html',
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [INPUTMASK_VALUE_ACCESSOR, DomHandler]
})
export class StoInputMaskComponent extends InputMask {
}

@NgModule({
    imports: [CommonModule, StoInputTextModule],
    exports: [StoInputMaskComponent],
    declarations: [StoInputMaskComponent]
})
export class StoInputMaskModule {
}
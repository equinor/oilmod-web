import { Component, NgModule,Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';

import { CustomComponent } from './CustomDecorator';
import {CommonModule} from '@angular/common';
import {ObserversModule} from '@angular/cdk/observers';
import {MdRippleModule, MdCommonModule} from '@angular/material/core';
import {A11yModule} from '@angular/cdk/a11y';
import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import { MdCheckbox } from '@angular/material/checkbox';

@CustomComponent({
  selector: 'si-checkbox-md',
  providers: [Renderer2, ChangeDetectorRef, FocusMonitor]
})
export class StoCheckboxComponentMD extends MdCheckbox {
  constructor(renderer: Renderer2,
              elementRef: ElementRef,
              changeDetectorRef: ChangeDetectorRef,
              focusMonitor: FocusMonitor) {
    super(renderer, elementRef, changeDetectorRef, focusMonitor);
  }
}

@NgModule({
    imports: [CommonModule, MdRippleModule, MdCommonModule, ObserversModule, A11yModule],
    exports: [StoCheckboxComponentMD],
    declarations: [StoCheckboxComponentMD],
    providers : [MdCheckbox]

})
export class StoCheckboxModule2 {

}
import { Directive, ElementRef, NgModule } from '@angular/core';
import { Button } from '../../vendor/primeface/components/button/button';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[stoButton]',
  providers: [DomHandler]
})
export class StoButtonDirective extends Button {

  constructor(public el: ElementRef, public domHandler: DomHandler) {
    super(el, domHandler);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [StoButtonDirective],
  declarations: [StoButtonDirective]
})
export class StoButtonModule {
}

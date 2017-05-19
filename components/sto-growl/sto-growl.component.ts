import { Component, ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Growl } from '../../vendor/primeface/components/growl/growl';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';

@Component({
  selector: 'sto-growl',
  templateUrl: './sto-growl.component.html',
  styleUrls: ['./sto-growl.component.scss'],
  providers: [DomHandler]
})
export class StoGrowlComponent extends Growl {
  constructor(public el: ElementRef, public domHandler: DomHandler) {
    super(el, domHandler);
  }
}


@NgModule({
  imports: [CommonModule],
  exports: [StoGrowlComponent],
  declarations: [StoGrowlComponent]
})
export class StoGrowlModule {
}

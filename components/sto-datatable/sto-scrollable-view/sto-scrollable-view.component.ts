import { Component, ElementRef, forwardRef, Inject, Renderer } from '@angular/core';
import { ScrollableView } from '../../../vendor/primeface/components/datatable/datatable';
import { StoDatatableComponent } from '../sto-datatable.component';
import { DomHandler } from '../../../vendor/primeface/components/dom/domhandler';
@Component({
  selector: '[stoScrollableView]',
  templateUrl: 'sto-scrollable-view.component.html'
})
export class StoScrollableView extends ScrollableView {

  constructor(@Inject(forwardRef(() => StoDatatableComponent))
              public dt: StoDatatableComponent,
              public domHandler: DomHandler,
              public el: ElementRef,
              public renderer: Renderer) {
    super(dt, domHandler, el, renderer);
  }
}

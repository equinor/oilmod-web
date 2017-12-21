import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer } from '@angular/core';
import { ScrollerComponent } from '../../../../vendor/ngx-datatable/components/body/scroller.component';

@Component({
  selector: 'sto-datatable-scroller',
  template: `
	  <ng-content></ng-content>
  `,
  host: {
    class: 'datatable-scroll'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoScrollerComponent extends ScrollerComponent {
  @Input() offset = 36; //TODO FIX

  @Input() set scrollHeight(val: number) {
    this._scrollHeight = val + this.offset;
  };

  constructor(element: ElementRef, renderer: Renderer) {
    super(element, renderer);
  }
}

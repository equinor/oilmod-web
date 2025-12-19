import { Directive, input } from '@angular/core';

@Directive({
  selector: '[stoGridSpacer]',
  host: {
    class: 'sto-grid__col sto-grid__col--spacer',
  },
})
export class StoGridSpacerDirective {}

@Directive({
  selector: '[stoGridColumn]',
  host: {
    class: 'sto-grid__col',
    '[class.sto-grid__col--2]': 'stoGridColumnDouble()',
  },
})
export class StoGridColumnDirective {
  readonly stoGridColumnDouble = input(false);
}

@Directive({
  selector: '[stoGrid]',
  exportAs: 'stoGrid',
  host: {
    class: 'sto-grid',
    '[style.max-width.px]': 'maxWidth()',
    '[style.min-width.px]': 'minWidth()',
  },
})
export class StoGridDirective {
  readonly maxWidth = input(1000);
  readonly minWidth = input(250);
}

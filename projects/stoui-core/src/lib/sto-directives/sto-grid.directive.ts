import { AfterContentInit, AfterViewInit, ContentChildren, Directive, ElementRef, HostBinding, Input, QueryList } from '@angular/core';

declare var ResizeObserver: any;

const getClass = (width: number) => {
  let cols = 1;
  const small = 400;
  const large = 800;
  if ( width > small ) {
    cols += 1;
  }
  if ( width > large ) {
    cols += 2;
  }
  return `sto-f-grid--${cols}`;
};

const ALL_GRIDS = [ 'sto-f-grid--1', 'sto-f-grid--2', 'sto-f-grid--4', 'sto-f-grid--6' ];

@Directive({ selector: '[stoGridSpacer]' })
export class StoGridSpacerDirective {
  @HostBinding('class.sto-f-grid__col')
  @HostBinding('class.sto-f-grid__col--spacer')
  useClass = true;
}

@Directive({ selector: '[stoGridColumn]' })
export class StoGridColumnDirective {
  @HostBinding('class.sto-f-grid__col')
  useClass = true;
  @HostBinding('class.sto-f-grid__col--2')
  @Input()
  stoGridColumnDouble: boolean;

}

@Directive({
  selector: '[stoGrid]',
  exportAs: 'stoGrid'
})
export class StoGridDirective implements AfterViewInit, AfterContentInit {
  @Input()
  stoGridMin: number;
  @Input()
  stoGridMax: number;
  @HostBinding('class.sto-f-grid')
  baseClass = true;
  @ContentChildren(StoGridColumnDirective, { read: ElementRef })
  columns: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private elRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit() {
    const el = this.elRef.nativeElement as HTMLElement;
    new ResizeObserver(entries => {
      for ( const entry of entries ) {
        const cr = entry.contentRect;
        const { width } = cr;
        const gridType = getClass(width);
        if ( !el.classList.contains(gridType) ) {
          el.classList.remove(...ALL_GRIDS);
          el.classList.add(gridType);
        }
      }
    }).observe(this.elRef.nativeElement);
  }

  ngAfterContentInit() {
  }

}


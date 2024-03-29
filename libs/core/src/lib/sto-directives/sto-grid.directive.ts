import { AfterViewInit, ContentChildren, Directive, ElementRef, HostBinding, Input, OnDestroy, QueryList } from '@angular/core';

interface BreakpointConfig {
  2: number;
  4: number;
}

const getClass = (width: number, small = 400, large = 800) => {
  let cols = 1;
  if ( width > small ) {
    cols += 1;
  }
  if ( width > large ) {
    cols += 2;
  }
  return `sto-f-grid--${cols}`;
};

const ALL_GRIDS = [ 'sto-f-grid--1', 'sto-f-grid--2', 'sto-f-grid--4', 'sto-f-grid--6' ];

@Directive({
  selector: '[stoGridSpacer]',
  standalone: true
})
export class StoGridSpacerDirective {
  @HostBinding('class.sto-f-grid__col')
  @HostBinding('class.sto-f-grid__col--spacer')
  useClass = true;
}

@Directive({
  selector: '[stoGridColumn]',
  standalone: true
})
export class StoGridColumnDirective {
  @HostBinding('class.sto-f-grid__col')
  useClass = true;
  @HostBinding('class.sto-f-grid__col--2')
  @Input()
  stoGridColumnDouble: boolean;

}

@Directive({
  selector: '[stoGrid]',
  exportAs: 'stoGrid',
  standalone: true
})
export class StoGridDirective implements AfterViewInit, OnDestroy {
  @HostBinding('style.max-width.px')
  @Input()
  maxWidth = 1000;
  @HostBinding('style.min-width.px')
  @Input()
  minWidth = 250;
  @HostBinding('class.sto-f-grid')
  baseClass = true;
  @ContentChildren(StoGridColumnDirective, { read: ElementRef })
  columns: QueryList<ElementRef<HTMLElement>>;
  @Input()
  breakpoints: BreakpointConfig;

  private observer: ResizeObserver;

  constructor(
    private elRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit() {
    const el = this.elRef.nativeElement as HTMLElement;
    this.observer = new ResizeObserver(entries => {
      for ( const entry of entries ) {
        const cr = entry.contentRect;
        const { width } = cr;
        const breakpoints = this.breakpoints || { 2: 400, 4: 800 };
        const gridType = getClass(width, breakpoints[ 2 ], breakpoints[ 4 ]);
        if ( !el.classList.contains(gridType) ) {
          el.classList.remove(...ALL_GRIDS);
          el.classList.add(gridType);
        }
      }
    });
    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy() {
    if ( this.observer ) {
      this.observer.disconnect();
    }
  }

}


import { AfterContentInit, AfterViewInit, ContentChildren, Directive, ElementRef, HostBinding, Input, QueryList } from '@angular/core';
import { startWith } from 'rxjs/operators';

declare var ResizeObserver: any;

const shouldBreak = (width: number, min: number, max: number) => {
  const xSmall = width <= 599;
  const small = width >= 600 && width <= 1022;
  const large = width >= 1023 && width <= 1919;
  const xlarge = width >= 1920;
};


@Directive({ selector: '[stoGridColumn]' })
export class StoGridColumnDirective {
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
  private gutter = 16;
  private minWidth: number;
  private maxWidth: number;
  private colCount = 0;

  constructor(
    private elRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit() {
    new ResizeObserver(entries => {
      for ( const entry of entries ) {
        const cr = entry.contentRect;
        const { width } = cr;
        const columnSize = this.columnSize(width, this.stoGridMin, this.stoGridMax);
        /*          const smallScreen = width < this.responsiveBreakPoint;
                  if ( this.smallScreen !== smallScreen ) {
                    this.smallScreen = smallScreen;
                    requestAnimationFrame(() => {
                      try {
                        this.cdr.markForCheck();
                        this.cdr.detectChanges();
                      } catch { /!** them all *!/
                      }
                    });
                  }*/
      }
    }).observe(this.elRef.nativeElement);
  }

  ngAfterContentInit() {
    this.updateChildren(this.columns);
  }

  private columnSize(width: number, min: number, max: number) {
    const singleColumn = width < min * 2;
    if ( singleColumn ) {
      this.minWidth = width;
      this.maxWidth = width;
      this.gutter = 16;
    } else {
      this.minWidth = this.stoGridMin;
      this.maxWidth = this.stoGridMax;
      this.gutter = width <= 719 ? 16 : 24;
    }
    const colCount = Math.floor(width / ( this.minWidth + this.gutter ));
    if ( this.colCount === colCount ) {
      return;
    }
    this.setColumnSize(this.minWidth, this.maxWidth, this.gutter);
    /*    const xsmall = width <= 599;
        const small = width >= 600 && width <= 1022;
        const large = width >= 1023 && width <= 1919;
        const xlarge = width >= 1920;*/
    // const colCount = Math.floor(width / ( min + this.gutter ));
    // const children = this.elRef.nativeElement.children;
    /*    Array.from(children)
          .forEach((child: HTMLElement) => {
            child.style.cssFloat = 'left';
            child.style.margin = `${16}px`;
            child.style.maxWidth = `${max}px`;
            child.style.minWidth = `${min}px`;
            child.style.height = '80px';
          });*/

  };

  private setColumnSize(min: number, max: number, gutter: number) {
    this.columns.forEach(col => {
      col.nativeElement.style.minWidth = `${min}px`;
      col.nativeElement.style.maxWidth = `${max}px`;
      col.nativeElement.style.margin = `${gutter}px`;
    });
  }

  private updateChildren(queryList: QueryList<ElementRef>) {
    queryList.changes
      .pipe(
        startWith(queryList)
      ).subscribe((list: QueryList<ElementRef>) => {
      list.forEach(el => {
        const child = el.nativeElement;
        child.style.cssFloat = 'left';
        child.style.margin = `${this.gutter}px`;
        child.style.maxWidth = `${this.stoGridMax}px`;
        child.style.minWidth = `${this.stoGridMin}px`;
        child.style.height = '80px';
      });
    });
  }

}


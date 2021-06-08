import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { RowActivation, RowContextMenu, RowSelection } from '../events';
import { Column, ColumnDisplay } from '../columns';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SelectionModes } from '../selection-modes';
import { rowClassFn } from '../models';

@Component({
  selector: 'sto-datatable-body',
  templateUrl: './sto-datatable-body.component.html',
  styleUrls: [ './sto-datatable-body.component.scss' ]
})
export class StoDatatableBodyComponent<T extends Record<string, unknown>> implements OnDestroy, AfterViewInit {

  @Input()
  get scrollbarH(): boolean {
    return this._scrollbarH;
  }

  set scrollbarH(scrollbarH: boolean) {
    this._scrollbarH = scrollbarH;
    this.horizontalScrollActive = false;
    if ( this.resizeObserver ) {
      this.resizeObserver.disconnect();
    }
    if ( scrollbarH && this.virtualScroll && this.vScroller ) {
      this.virtHorzScrollPosition();
    } else if ( scrollbarH ) {
      this.horzScrollPosition();
    }
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }

  @ViewChild('scrollViewport', { read: ElementRef })
  scrollElement: ElementRef<HTMLElement>;
  @Input()
  responsive: boolean;
  @Input()
  disableRipple: boolean;
  @Input()
  smallView: boolean;
  @Input()
  responsiveView: TemplateRef<unknown>;
  @Input()
  height: number | null;
  @Input()
  rows: Array<T>;
  @Input()
  selectable: boolean;
  @Input()
  width: string;
  @Input()
  rowHeight: number;
  @Input()
  selected: T;
  @Input()
  columns: Column[];
  @Input()
  virtualScroll: boolean;
  @Input()
  columnMode: ColumnDisplay;

  private _scrollbarH: boolean;
  @Input()
  rowClass: rowClassFn;
  @Input()
  selectionMode: SelectionModes;
  @Input()
  scrollLeft: string | null;
  @Input()
  hasFooter: boolean;
  @Output()
  rowSelected = new EventEmitter<RowSelection<T>>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  activate = new EventEmitter<RowActivation<T>>();
  @Output()
  scrollHeader = new EventEmitter<Event>();
  @ViewChild(CdkVirtualScrollViewport)
  vScroller: CdkVirtualScrollViewport;
  @ViewChild('scroller')
  scroller: ElementRef<HTMLDivElement>;

  private destroyed$ = new Subject<boolean>();
  private rowDiffer: KeyValueDiffer<T, T>;
  private timeout: number | undefined;
  private resizeObserver: ResizeObserver;
  public horizontalScrollActive: boolean;
  public verticalScrollOffset = 0;

  constructor(private differs: KeyValueDiffers) {
    this.rowDiffer = differs.find({}).create();
  }

  @HostListener('window:resize', [ '$event' ])
  onresize() {
    if ( !this.vScroller ) {
      return;
    }
    if ( this.timeout ) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.vScroller.ngOnInit();
    }, 100);
  }

  @Input()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackBy = (index: number, item: T) => {
    return index;
  }
  _rowClass = (row: T) => {
    let userDefinedClass = '';
    if ( this.rowClass ) {
      userDefinedClass = this.rowClass.bind(this)(row);
    }
    return `${userDefinedClass} sto-mdl-table__body__row`;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if ( this.resizeObserver ) {
      this.resizeObserver.disconnect();
    }
  }

  ngAfterViewInit() {
    if ( this.scrollbarH && this.virtualScroll ) {
      this.virtHorzScrollPosition();
    } else if ( this.scrollbarH ) {
      this.horzScrollPosition();
    }
  }

  private horzScrollPosition() {
    if ( !this.scroller ) {
      return;
    }
    const elRef = this.scroller.nativeElement;
    const cb: ResizeObserverCallback = (entries) => {
      if ( !this.hasFooter ) {
        return;
      }
      for ( const entry of entries ) {
        const t = entry.target as HTMLElement;
        const el = t;
        const currentScale = el.style.transform;
        const notScaled = this.rows.length * this.rowHeight;
        this.verticalScrollOffset = t.scrollHeight > t.offsetHeight ? 14 : 0;
        if ( t.scrollWidth > t.offsetWidth ) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if ( !strScale ) {
            return;
          }
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale === notScaled ) {
            const newScaleValue = notScaled + this.rowHeight;
            el.style.transform = `scaleY(${newScaleValue}`;
          }
        } else {
          this.horizontalScrollActive = false;
          const strScale = /\d+/.exec(currentScale || '');
          if ( !strScale ) {
            return;
          }
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale !== notScaled ) {
            el.style.transform = `scaleY(${notScaled}`;
          }
        }
      }
    };
    this.resizeObserver = new ResizeObserver(cb);
    this.resizeObserver.observe(elRef);
  }

  private virtHorzScrollPosition() {
    const elRef = this.vScroller.elementRef.nativeElement;
    const cb: ResizeObserverCallback = (entries) => {
      if ( !this.hasFooter ) {
        return;
      }
      for ( const entry of entries ) {
        const t = entry.target as HTMLElement;
        const el = t.querySelector('.cdk-virtual-scroll-spacer') as HTMLDivElement;
        const currentScale = el.style.transform;
        const notScaled = this.rows.length * this.rowHeight;
        this.verticalScrollOffset = t.scrollHeight > t.offsetHeight ? 14 : 0;
        if ( t.scrollWidth > t.offsetWidth ) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if ( !strScale ) {
            return;
          }
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale === notScaled ) {
            const newScaleValue = notScaled + this.rowHeight;
            el.style.transform = `scaleY(${newScaleValue}`;
          }
        } else {
          this.horizontalScrollActive = false;
          const strScale = /\d+/.exec(currentScale || '');
          if ( !strScale ) {
            return;
          }
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale !== notScaled ) {
            el.style.transform = `scaleY(${notScaled}`;
          }
        }
      }
    };
    this.resizeObserver = new ResizeObserver(cb);
    this.resizeObserver.observe(elRef);
  }

  selectRow(event: KeyboardEvent | MouseEvent, activationData: RowSelection<T>) {
    if ( event.type === this.selectionMode ) {
      this.rowSelected.emit(activationData);
      const el = event.target as HTMLElement;
      const ignoreRe = /.*mat-select.*|.*mat-option.*|.*mat-input.*|.*mat-form.*/i;
      const elTag = el.tagName.toLowerCase();
      const isIgnoredEl = ignoreRe.test(el.className) || elTag === 'input';
      if ( !isIgnoredEl ) {
        activationData.rowEl?.focus();
      }
    }
  }

  onKeyDownHandler(event: KeyboardEvent, rowEl: HTMLDivElement, activationData: RowSelection<T> | RowActivation<T>) {
    this.activate.emit({ event, rowEl, row: activationData.row, index: activationData.index });
    const next = rowEl.nextSibling as HTMLDivElement;
    const prev = rowEl.previousSibling as HTMLDivElement;
    switch ( event.key ) {
      case 'ArrowDown':
        if ( next && next instanceof HTMLElement ) {
          next.focus();
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if ( prev && prev instanceof HTMLElement ) {
          prev.focus();
          event.preventDefault();
        }
        break;
      case 'Enter':
        this.rowSelected.emit(activationData);
        break;
    }
  }

}

import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Column, ColumnDisplay } from '../columns';
import { RowActivation, RowContextMenu, RowSelection } from '../events';
import { rowClassFn } from '../models';
import { SelectionModes } from '../selection-modes';

import { MatRipple } from '@angular/material/core';
import { StoDatatableBodyRowComponent } from './sto-datatable-body-row/sto-datatable-body-row.component';

@Component({
  selector: 'sto-datatable-body',
  templateUrl: './sto-datatable-body.component.html',
  styleUrls: ['./sto-datatable-body.component.scss'],
  host: {
    class: 'datatable-body',
  },
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    StoDatatableBodyRowComponent,
    MatRipple,
  ],
})
export class StoDatatableBodyComponent<T extends Record<string, unknown>>
  implements OnDestroy, AfterViewInit
{
  @ViewChild('scrollViewport', { read: ElementRef })
  scrollElement: ElementRef<HTMLElement>;
  readonly responsive = input<boolean>();
  readonly disableRipple = input<boolean>(false);
  readonly smallView = input<boolean>();
  readonly responsiveView = input<TemplateRef<unknown>>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  height: number | null;
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  rows: Array<T>;
  readonly selectable = input<boolean>();
  readonly width = input<string>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  rowHeight: number;
  readonly selected = input<T>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  columns: Column[];
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  virtualScroll: boolean;
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  readonly rowClass = input<rowClassFn>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  selectionMode: SelectionModes;
  readonly scrollLeft = input<string | null>();
  readonly hasFooter = input<boolean>();
  readonly rowSelected = output<RowSelection<T>>();
  readonly rowContextMenu = output<RowContextMenu<T>>();
  readonly activate = output<RowActivation<T>>();
  readonly scrollHeader = output<Event>();
  @ViewChild(CdkVirtualScrollViewport)
  vScroller: CdkVirtualScrollViewport;
  @ViewChild('scroller')
  scroller: ElementRef<HTMLDivElement>;
  public horizontalScrollActive: boolean;
  public verticalScrollOffset = 0;
  private destroyed$ = new Subject<boolean>();
  private timeout: number | undefined;
  private resizeObserver: ResizeObserver;

  private _scrollbarH: boolean;

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input()
  get scrollbarH(): boolean {
    return this._scrollbarH;
  }

  set scrollbarH(scrollbarH: boolean) {
    this._scrollbarH = scrollbarH;
    this.horizontalScrollActive = false;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (scrollbarH && this.virtualScroll && this.vScroller) {
      this.virtHorzScrollPosition();
    } else if (scrollbarH) {
      this.horzScrollPosition();
    }
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }

  @HostListener('window:resize', ['$event'])
  onresize() {
    if (!this.vScroller) {
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.vScroller.ngOnInit();
    }, 100);
  }

  readonly trackBy = input((index: number, item: T) => {
    return index;
  });
  _rowClass = (row: T) => {
    let userDefinedClass = '';
    const rowClass = this.rowClass();
    if (rowClass) {
      userDefinedClass = rowClass.bind(this)(row);
    }
    return `${userDefinedClass} sto-mdl-table__body__row`;
  };

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  ngAfterViewInit() {
    if (this.scrollbarH && this.virtualScroll) {
      this.virtHorzScrollPosition();
    } else if (this.scrollbarH) {
      this.horzScrollPosition();
    }
  }

  selectRow(
    event: KeyboardEvent | MouseEvent,
    activationData: RowSelection<T>,
  ) {
    if (event.type === this.selectionMode) {
      this.rowSelected.emit(activationData);
      const el = event.target as HTMLElement;
      const ignoreRe =
        /.*mat-select.*|.*mat-option.*|.*mat-input.*|.*mat-form.*/i;
      const elTag = el.tagName.toLowerCase();
      const isIgnoredEl = ignoreRe.test(el.className) || elTag === 'input';
      if (!isIgnoredEl) {
        activationData.rowEl?.focus();
      }
    }
  }

  onKeyDownHandler(
    event: KeyboardEvent,
    rowEl: HTMLDivElement,
    activationData: RowSelection<T> | RowActivation<T>,
  ) {
    this.activate.emit({
      event,
      rowEl,
      row: activationData.row,
      index: activationData.index,
    });
    const next = rowEl.nextSibling as HTMLDivElement;
    const prev = rowEl.previousSibling as HTMLDivElement;
    switch (event.key) {
      case 'ArrowDown':
        if (next && next instanceof HTMLElement) {
          next.focus();
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (prev && prev instanceof HTMLElement) {
          prev.focus();
          event.preventDefault();
        }
        break;
      case 'Enter':
        this.rowSelected.emit(activationData);
        break;
    }
  }

  private horzScrollPosition() {
    if (!this.scroller) {
      return;
    }
    const elRef = this.scroller.nativeElement;
    const cb: ResizeObserverCallback = (entries) => {
      if (!this.hasFooter()) {
        return;
      }
      for (const entry of entries) {
        const t = entry.target as HTMLElement;
        const el = t;
        const currentScale = el.style.transform;
        const notScaled = this.rows.length * this.rowHeight;
        this.verticalScrollOffset = t.scrollHeight > t.offsetHeight ? 14 : 0;
        if (t.scrollWidth > t.offsetWidth) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale === notScaled) {
            const newScaleValue = notScaled + this.rowHeight;
            el.style.transform = `scaleY(${newScaleValue}`;
          }
        } else {
          this.horizontalScrollActive = false;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale !== notScaled) {
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
      if (!this.hasFooter()) {
        return;
      }
      for (const entry of entries) {
        const t = entry.target as HTMLElement;
        const el = t.querySelector(
          '.cdk-virtual-scroll-spacer',
        ) as HTMLDivElement;
        const currentScale = el.style.transform;
        const notScaled = this.rows.length * this.rowHeight;
        this.verticalScrollOffset = t.scrollHeight > t.offsetHeight ? 14 : 0;
        if (t.scrollWidth > t.offsetWidth) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale === notScaled) {
            const newScaleValue = notScaled + this.rowHeight;
            el.style.transform = `scaleY(${newScaleValue}`;
          }
        } else {
          this.horizontalScrollActive = false;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale !== notScaled) {
            el.style.transform = `scaleY(${notScaled}`;
          }
        }
      }
    };
    this.resizeObserver = new ResizeObserver(cb);
    this.resizeObserver.observe(elRef);
  }
}

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
  OnDestroy,
  TemplateRef,
  booleanAttribute,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Column, ColumnDisplay } from '../columns';
import { RowActivation, RowContextMenu, RowSelection } from '../events';
import { rowClassFn } from '../models';
import { SelectionModes, SelectionModesEnum } from '../selection-modes';

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
export class StoDatatableBodyComponent<T extends object>
  implements OnDestroy, AfterViewInit
{
  scrollElement = viewChild('scrollViewport', {
    read: ElementRef<HTMLElement>,
  });
  readonly responsive = input<boolean>();
  readonly disableRipple = input<boolean>(false);
  readonly smallView = input<boolean>();
  readonly responsiveView = input<TemplateRef<unknown>>();
  height = input<number>(500);
  rows = input<Array<T>>([]);
  readonly selectable = input<boolean>();
  readonly width = input<string>();
  rowHeight = input<number>(28);
  readonly selected = input<T>();
  columns = input<Column[]>([]);
  virtualScroll = input(true, { transform: booleanAttribute });
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  readonly rowClass = input<rowClassFn>();
  selectionMode = input<SelectionModes>(SelectionModesEnum.DoubleClick);
  readonly scrollLeft = input<string | null>();
  readonly hasFooter = input<boolean>();
  readonly rowSelected = output<RowSelection<T>>();
  readonly rowContextMenu = output<RowContextMenu<T>>();
  readonly activate = output<RowActivation<T>>();
  readonly scrollHeader = output<Event>();
  vScroller = viewChild(CdkVirtualScrollViewport);
  scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');
  public horizontalScrollActive: boolean;
  public verticalScrollOffset = signal(0);
  private destroyed$ = new Subject<boolean>();
  // Using ReturnType<typeof setTimeout> works for both browser (number) and Node/JSDOM (Timeout) environments
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private resizeObserver: ResizeObserver;

  scrollbarH = input<boolean>(false);
  onScrollbarHChange = effect(() => {
    // Triggers
    const scrollbarH = this.scrollbarH();
    const vScroll = this.virtualScroll();
    const vScroller = this.vScroller();
    // Actions
    this.horizontalScrollActive = false;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (scrollbarH && vScroll && vScroller) {
      this.virtHorzScrollPosition();
    } else if (scrollbarH) {
      this.horzScrollPosition();
    }
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  });

  @HostListener('window:resize', ['$event'])
  onresize() {
    if (!this.vScroller()) {
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.vScroller()?.ngOnInit(), 100);
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
    if (this.scrollbarH() && this.virtualScroll()) {
      this.virtHorzScrollPosition();
    } else if (this.scrollbarH()) {
      this.horzScrollPosition();
    }
  }

  selectRow(
    event: KeyboardEvent | MouseEvent,
    activationData: RowSelection<T>,
  ) {
    if (event.type === this.selectionMode()) {
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
    if (!this.scroller()) {
      return;
    }
    const elRef = this.scroller()!.nativeElement;
    const cb: ResizeObserverCallback = (entries) => {
      if (!this.hasFooter()) {
        return;
      }
      for (const entry of entries) {
        const t = entry.target as HTMLElement;
        const el = t;
        const currentScale = el.style.transform;
        const notScaled = this.rows().length * this.rowHeight();
        this.verticalScrollOffset.set(t.scrollHeight > t.offsetHeight ? 14 : 0);
        if (t.scrollWidth > t.offsetWidth) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale === notScaled) {
            const newScaleValue = notScaled + this.rowHeight();
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
    const elRef = this.vScroller()?.elementRef.nativeElement;
    if (!elRef) return;

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
        const notScaled = this.rows().length * this.rowHeight();
        this.verticalScrollOffset.set(t.scrollHeight > t.offsetHeight ? 14 : 0);
        if (t.scrollWidth > t.offsetWidth) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if (!strScale) {
            return;
          }
          const numericScale = Number(strScale[0]);
          if (numericScale === notScaled) {
            const newScaleValue = notScaled + this.rowHeight();
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

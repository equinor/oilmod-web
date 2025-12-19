import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { Column, ColumnDisplay } from '../columns';
import { RowActivation, RowContextMenu, RowSelection } from '../events';
import { rowClassFn } from '../models';
import { SelectionModes, SelectionModesEnum } from '../selection-modes';

import { MatRipple } from '@angular/material/core';
import { StoRowWidthHelper } from '../../sto-row-width.helper';
import { StoDatatableBodyRowComponent } from './sto-datatable-body-row/sto-datatable-body-row.component';

@Component({
  selector: 'sto-datatable-body',
  templateUrl: './sto-datatable-body.component.html',
  styleUrl: './sto-datatable-body.component.scss',
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
  implements AfterViewInit
{
  // Dependency injection
  private readonly destroyRef = inject(DestroyRef);
  private readonly rowWidthHelper = inject(StoRowWidthHelper);
  private readonly el = inject(ElementRef);

  // Static regex patterns for performance
  private static readonly IGNORE_ELEMENT_REGEX =
    /.*mat-select.*|.*mat-option.*|.*mat-input.*|.*mat-form.*/i;

  // Inputs - Configuration
  readonly columns = input<Column[]>([]);
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  readonly disableRipple = input<boolean>(false);
  readonly hasFooter = input<boolean>();
  readonly height = input<number>(500);
  readonly responsive = input<boolean>();
  readonly responsiveView = input<TemplateRef<unknown>>();
  readonly rowClass = input<rowClassFn>();
  readonly rowHeight = input<number>(28);
  readonly rows = input<Array<T>>([]);
  readonly scrollbarH = input<boolean>(false);
  readonly scrollLeft = input<string | null>();
  readonly selectable = input<boolean>();
  readonly selected = input<T>();
  readonly selectionMode = input<SelectionModes>(
    SelectionModesEnum.DoubleClick,
  );
  readonly smallView = input<boolean>();
  readonly trackBy = input((index: number, item: T) => index);
  readonly virtualScroll = input(true, { transform: booleanAttribute });
  readonly width = input<string>();

  // Outputs - Events
  readonly activate = output<RowActivation<T>>();
  readonly rowContextMenu = output<RowContextMenu<T>>();
  readonly rowSelected = output<RowSelection<T>>();
  readonly scrollHeader = output<Event>();

  // View children
  readonly scrollElement = viewChild('scrollViewport', {
    read: ElementRef<HTMLElement>,
  });
  readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');
  readonly vScroller = viewChild(CdkVirtualScrollViewport);

  // Public signals for template binding
  readonly horizontalScrollActive = signal(false);
  readonly verticalScrollOffset = signal(0);

  // Computed signals
  private readonly notScaledHeight = computed(
    () => this.rows().length * this.rowHeight(),
  );

  // Private state
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private resizeObserver?: ResizeObserver;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    });

    // Effect to check viewport size when rows change
    effect(() => {
      const rows = this.rows();
      const vScroller = this.vScroller();
      this.checkViewportSize();
    });
  }

  // Lifecycle hooks
  ngAfterViewInit() {
    if (this.scrollbarH() && this.virtualScroll()) {
      this.virtHorzScrollPosition();
    } else if (this.scrollbarH()) {
      this.horzScrollPosition();
    }

    // Force virtual scroller to check viewport size after initialization
    this.checkViewportSize();
  }

  private checkViewportSize() {
    if (this.virtualScroll()) {
      const vScroller = this.vScroller();
      if (vScroller) {
        setTimeout(() => {
          vScroller.checkViewportSize();
        }, 0);
      }
    }
  }

  @HostListener('window:resize')
  onresize() {
    // Get real width of a body row
    const rowEl = this.el.nativeElement.querySelector('.datatable-body-row');
    if (!rowEl) return;
    this.rowWidthHelper.currentRowWidth.set(
      rowEl.getBoundingClientRect().width,
    );

    // Trigger virtual scroll recalculation
    const vScroller = this.vScroller();
    if (!vScroller) return;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => vScroller.ngOnInit(), 100);
  }

  // Public methods
  _rowClass = (row: T) => {
    const rowClass = this.rowClass();
    if (!rowClass) return 'sto-mdl-table__body__row';

    let userDefinedClass = '';
    if (typeof rowClass === 'function') {
      userDefinedClass = rowClass(row);
    } else if (typeof rowClass === 'string') {
      userDefinedClass = rowClass;
    }

    return userDefinedClass
      ? `${userDefinedClass} sto-mdl-table__body__row`
      : 'sto-mdl-table__body__row';
  };

  selectRow(
    event: KeyboardEvent | MouseEvent,
    activationData: RowSelection<T>,
  ) {
    if (event.type === this.selectionMode()) {
      this.rowSelected.emit(activationData);
      const el = event.target as HTMLElement;
      const elTag = el.tagName.toLowerCase();
      const isIgnoredEl =
        StoDatatableBodyComponent.IGNORE_ELEMENT_REGEX.test(el.className) ||
        elTag === 'input';
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
    const scrollerEl = this.scroller()?.nativeElement;
    if (!scrollerEl) return;

    this.setupResizeObserver(scrollerEl, scrollerEl);
  }

  private virtHorzScrollPosition() {
    const elRef = this.vScroller()?.elementRef.nativeElement;
    if (!elRef) return;

    const spacerEl = elRef.querySelector(
      '.cdk-virtual-scroll-spacer',
    ) as HTMLDivElement;
    if (!spacerEl) return;

    this.setupResizeObserver(elRef, spacerEl);
  }

  /**
   * Sets up ResizeObserver to handle horizontal scrollbar and vertical scroll offset
   * @param observeEl - Element to observe for size changes
   * @param scaleEl - Element whose transform will be scaled
   */
  private setupResizeObserver(observeEl: HTMLElement, scaleEl: HTMLElement) {
    const cb: ResizeObserverCallback = (entries) => {
      if (!this.hasFooter() || entries.length === 0) return;

      // Only process the first entry to avoid redundant calculations
      const target = entries[0].target as HTMLElement;
      this.updateScrollState(target, scaleEl);
    };

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.resizeObserver = new ResizeObserver(cb);
    this.resizeObserver.observe(observeEl);
  }

  private static readonly SCALE_REGEX = /scaleY\((\d+)/;

  /**
   * Updates scroll state and adjusts element scaling for horizontal scrollbar
   */
  private updateScrollState(target: HTMLElement, scaleEl: HTMLElement) {
    const hasVerticalScroll = target.scrollHeight > target.offsetHeight;
    const hasHorizontalScroll = target.scrollWidth > target.offsetWidth;
    const notScaled = this.notScaledHeight();

    // Update vertical scroll offset for footer positioning
    this.verticalScrollOffset.set(hasVerticalScroll ? 14 : 0);
    this.horizontalScrollActive.set(hasHorizontalScroll);

    // Extract current scale value using cached regex
    const currentScale = scaleEl.style.transform;
    const scaleMatch = StoDatatableBodyComponent.SCALE_REGEX.exec(
      currentScale || '',
    );
    if (!scaleMatch) return;

    const currentScaleValue = Number(scaleMatch[1]);
    const targetScale = hasHorizontalScroll
      ? notScaled + this.rowHeight()
      : notScaled;

    // Only update if scale needs to change
    if (currentScaleValue !== targetScale) {
      scaleEl.style.transform = `scaleY(${targetScale}`;
    }
  }
}

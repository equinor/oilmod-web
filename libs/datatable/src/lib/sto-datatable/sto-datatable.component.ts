import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { StoRowWidthHelper } from '../sto-row-width.helper';
import { ColumnStylePipe } from './column-style.pipe';
import { Column, ColumnDisplay, ColumnGroup, Group } from './columns';
import {
  HeaderContextMenu,
  RowActivation,
  RowContextMenu,
  RowSelection,
} from './events';
import { rowClassFn } from './models';
import { observeWidth } from './observer';
import { SelectionModes, SelectionModesEnum } from './selection-modes';
import { StoDatatableActionsComponent } from './sto-datatable-actions/sto-datatable-actions.component';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { StoDatatableHeaderGroupComponent } from './sto-datatable-header-group/sto-datatable-header-group.component';
import { StoDatatableHeaderComponent } from './sto-datatable-header/sto-datatable-header.component';

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: [
    './sto-datatable.component.scss',
    './sto-datatable-progress-bar.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StoDatatableHeaderGroupComponent,
    StoDatatableHeaderComponent,
    StoDatatableBodyComponent,
    NgStyle,
    NgTemplateOutlet,
    ColumnStylePipe,
  ],
  host: {
    class: 'sto-datatable ngx-datatable',
    '[class.horizontal-scroll]': 'scrollbarH()',
    '[class.sortable]': 'sortable()',
    '[class.autosize]': 'autoSize()',
    '[class.virtual-scroll]': 'virtualScroll()',
    '[class.mat-elevation-z3]': 'elevation()',
    '[class.responsive]': 'smallScreen()',
    '[class.resizeable]': 'resizeable()',
  },
  providers: [StoRowWidthHelper],
})
export class StoDatatableComponent<T extends object> implements AfterViewInit {
  private readonly elRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly groups = input<Array<Group>>([]);
  readonly rowHeight = input<number>(36);
  readonly headerHeight = input<number>(24);
  readonly scrollbarH = input<boolean>(false);
  readonly selectionMode = input<SelectionModes>(SelectionModesEnum.Click);
  readonly sortable = input<boolean>(true);
  readonly height = input<number>();
  readonly autoSize = input<boolean>(false);
  readonly virtualScroll = input<boolean>(true);
  readonly elevation = input<boolean>(true);
  readonly columnGroups = input<ColumnGroup[]>([]);
  readonly preserveSort = input<boolean>(false);
  readonly autoSizeOffset = input<number>(0);
  readonly responsiveView = input<TemplateRef<unknown>>();
  readonly responsiveBreakPoint = input<number>(400);
  readonly externalSort = input<boolean>();
  readonly emptyMessage = input<string>(`No records in set`);
  readonly disableRipple = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly rowClass = input<rowClassFn>();
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  readonly resizeable = input<boolean>(false);
  readonly responsive = input<boolean>(false);
  _responsive = linkedSignal(() => this.responsive());

  readonly body = viewChild.required(StoDatatableBodyComponent<T>);
  readonly actions = contentChild(StoDatatableActionsComponent);
  readonly ColumnDisplay = ColumnDisplay;

  selected = model<T>();
  readonly smallScreen = signal(false);
  readonly scrollLeft = signal('translate3d(0px, 0px, 0px)');

  // Outputs
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly select = output<RowSelection<T>>();
  readonly resized = output<Column>();
  readonly rowContextMenu = output<RowContextMenu<T>>();
  readonly headerContextMenu = output<HeaderContextMenu>();
  readonly rowActivate = output<RowActivation<T>>();
  readonly sortChanged = output<{ sort: Sort; column: Column }>();

  private resizeTimeout: number | undefined;

  private sortKey = `${window?.location?.hostname}_${window?.location?.pathname}_sort`;
  activeSort = linkedSignal<Sort | null>(() => {
    let sort;
    if (this.preserveSort()) {
      const sortStr = localStorage.getItem(this.sortKey);
      try {
        sort = sortStr ? JSON.parse(sortStr) : null;
      } catch {
        /*em all*/
      }
    }
    return sort;
  });
  private onActiveSortChange = effect(() => {
    if (this.preserveSort() && this.activeSort()) {
      localStorage.setItem(this.sortKey, JSON.stringify(this.activeSort()));
    }
  });

  readonly _height = computed<string>(
    () =>
      (this.autoSize() ? `${this._calcHeight()}px` : `${this.height()}px`) ||
      'auto',
  );
  private readonly _calcHeight = toSignal(
    fromEvent(window, 'resize').pipe(
      startWith(null),
      debounceTime(100), // Increased to reduce expensive getBoundingClientRect calls
      map(() =>
        (this.elRef.nativeElement as HTMLElement).getBoundingClientRect(),
      ),
      map((rect) => rect.top),
      map(
        (top) =>
          window.innerHeight -
          top -
          20 -
          this.autoSizeOffset() -
          (this.actions() ? 6 : 0),
      ),
      takeUntilDestroyed(this.destroyRef),
    ),
  );
  readonly bodyHeight = computed<number>(() => {
    if (!this._height() || !this.body()) return 0;

    const hasHeader =
      !this._responsive() || (this._responsive() && !this.smallScreen());
    const footerRows = this._footerRows();
    const hasFooter =
      footerRows &&
      (!this._responsive() || (this._responsive() && !this.smallScreen()));
    const hasHeaderGroup =
      (!this._responsive() || (this._responsive() && !this.smallScreen())) &&
      this.columnGroups()?.length;
    const headerOffset = hasHeader ? this.headerHeight() : 0;
    const actionsHeight = this.actions() ? this.actions()!.height() : 0;
    const footerOffset = hasFooter ? this.rowHeight() * footerRows.length : 0;
    const groupOffset = hasHeaderGroup ? this.headerHeight() : 0;

    // Optimize string parsing - avoid double replace
    const heightStr = this._height();
    const heightValue = heightStr === 'auto' ? 0 : parseFloat(heightStr);

    return (
      heightValue - headerOffset - footerOffset - groupOffset - actionsHeight
    );
  });

  width = computed(() => {
    if (this.scrollbarH() && this._columns()) {
      const widthOffset =
        this.bodyHeight() && this.rowTotalHeight() > this.bodyHeight() ? 12 : 0;
      return `${this.columnTotalWidth() + widthOffset}px`;
    }
    return 'auto';
  });

  // Rows management with signals
  readonly rows = input<T[]>([]);
  readonly footerRow = input<T | T[]>();

  private readonly _sortedRows = signal<T[]>([]);

  readonly rowTotalHeight = computed(
    () => (this.rows()?.length || 0) * this.rowHeight(),
  );

  readonly _internalRows = computed(() => {
    const currentSort = this.activeSort();
    if (!currentSort || currentSort.direction === '' || this.externalSort()) {
      return this.rows() || [];
    }
    return this._sortedRows() || [];
  });

  readonly _footerRows = computed(() => {
    const footer = this.footerRow();
    if (!footer || typeof footer !== 'object') {
      return undefined;
    }
    return Array.isArray(footer) ? footer : [footer];
  });

  // Effect to handle initial sorting when rows change
  private onRowsChange = effect(() => {
    const rows = this.rows();
    const currentSort = this.activeSort();

    if (!rows || rows.length === 0) {
      this._sortedRows.set([]);
      return;
    }

    const externalSort = this.externalSort();
    if (!this.preserveSort() && !externalSort) {
      this.activeSort.set(null);
    }

    if (currentSort && !externalSort) {
      const column = this._columns().find(
        (col) => col.$$id === currentSort.active,
      );
      if (column) {
        this.performSort(currentSort);
      }
    } else {
      this._sortedRows.set([...rows]);
    }
  });

  readonly columns = input<Column[]>([]);
  readonly _columns = linkedSignal<Column[]>(() => {
    const cols = this.columns();
    if (cols == null || cols.length === 0) {
      return [];
    }
    const isResizeable = this.resizeable();
    // Cache column transformations to avoid recreating objects
    return cols.map((column, index) => ({
      ...column,
      $$id: btoa(`${column.prop}${column.name}${index}`),
      flexShrink: isResizeable ? 0 : column.flexShrink,
      flexGrow: isResizeable ? 0 : column.flexGrow,
    }));
  });
  readonly columnTotalWidth = computed(() =>
    this._columns()
      .map((c) => c.flexBasis || 80)
      .reduce((a, b) => a + b, 0),
  );

  readonly trackBy = input((index: number) => {
    return index;
  });

  rowClick(row: T, index: number, event: MouseEvent) {
    this.selected.set(row);
    this.select.emit({ row, index, event });
  }

  trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  ngAfterViewInit() {
    if (this.resizeable() && !this.scrollbarH()) {
      console.warn(
        `Datatable: Not allowed to have resizeable columns without horizontal scroll. Set [scrollbarH]="true"`,
      );
    }
    if (this.responsive() && !this.responsiveView()) {
      console.error(
        'Responsive mode set to true, but no view passed in. Please pass in responsiveView (templateRef)',
      );
      this._responsive.set(false);
    } else if (this._responsive()) {
      observeWidth(this.elRef.nativeElement)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((width) =>
          this.smallScreen.set(width < this.responsiveBreakPoint()),
        );
    }

    this.destroyRef.onDestroy(() => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
    });
  }

  public scrollTo(item: T | number, behaviour: ScrollBehavior = 'smooth') {
    if (this.body().vScroller()) {
      if (typeof item === 'number') {
        this.scrollToIndex(item, behaviour);
      } else {
        const index = this._internalRows().indexOf(item);
        if (index >= 0) {
          this.scrollToIndex(index, behaviour);
        }
      }
    }
  }

  setHeaderScroll(event: Event) {
    const left = (event.target as HTMLElement).scrollLeft;
    // Optimize: avoid template literal when value is 0
    this.scrollLeft.set(
      left === 0
        ? 'translate3d(0px, 0px, 0px)'
        : `translate3d(-${left}px, 0px, 0px)`,
    );
  }

  scrollBodyAndHeader(event: Event) {
    const left = (event.target as HTMLElement).scrollLeft;
    // Optimize: avoid template literal when value is 0
    this.scrollLeft.set(
      left === 0
        ? 'translate3d(0px, 0px, 0px)'
        : `translate3d(-${left}px, 0px, 0px)`,
    );
  }

  sort(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.activeSort.set(null);
      this._sortedRows.set([...this.rows()]);
      return;
    }
    this.activeSort.set(sort);
    const column = this._columns().find((c) => c.$$id === sort.active);
    if (!column) {
      return;
    }
    if (this.externalSort()) {
      this.sortChanged.emit({ sort, column });
      return;
    }
    this.performSort(sort);
  }

  private performSort(sort: Sort) {
    const column = this._columns().find((c) => c.$$id === sort.active);
    if (!column) return;

    const fn = column.sortFn || this.defaultSortFn;
    const rows = this.rows();
    const multiplier = sort.direction === 'asc' ? 1 : -1;

    // Use Array.from to avoid defensive copy when we know we'll mutate
    const sorted = Array.from(rows).sort(
      (a, b) => fn(a, b, column) * multiplier,
    );
    this._sortedRows.set(sorted);
  }

  onResize({ columns, column }: { columns: Column[]; column: Column }) {
    // Directly update _columns with the resized values from the header component
    const currentCols = this._columns();
    const updated = currentCols.map((c) =>
      c.prop === column.prop
        ? { ...c, flexBasis: column.flexBasis, flexGrow: 0, flexShrink: 0 }
        : { ...c, flexGrow: 0, flexShrink: 0 },
    );
    this._columns.set(updated);

    this.resized.emit(column);
  }

  private scrollToIndex(index: number, behaviour: ScrollBehavior) {
    if (this.body().vScroller()) {
      this.body().vScroller()?.scrollToIndex(index, behaviour);
    }
  }

  private defaultSortFn(a: T, b: T, col: Column) {
    const key = col.prop as keyof T;
    const aValue = (a as T)[key];
    const bValue = (b as T)[key];
    if (aValue === null || aValue === undefined) {
      return -1;
    }
    if (bValue === null || bValue === undefined) {
      return 1;
    }
    return aValue === bValue ? 0 : aValue < bValue ? -1 : 1;
  }
}

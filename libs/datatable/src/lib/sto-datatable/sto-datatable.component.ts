import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  linkedSignal,
  model,
  OnDestroy,
  Output,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
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
})
export class StoDatatableComponent<T extends object>
  implements AfterViewInit, OnDestroy
{
  private elRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

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
  ColumnDisplay = ColumnDisplay;
  public rowTotalHeight: number;
  selected = model<T>();
  public smallScreen = signal(false);

  // TODO: Cannot migrate because:
  // Your application code relies on internal rxjs only implementation details
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native -- keeping legacy public API '(select)' output
  select = new EventEmitter<RowSelection<T>>();
  readonly resized = output<Column>();
  readonly rowContextMenu = output<RowContextMenu<T>>();
  readonly headerContextMenu = output<HeaderContextMenu>();
  readonly rowActivate = output<RowActivation<T>>();
  readonly sortChanged = output<{ sort: Sort; column: Column }>();
  public scrollLeft = 'translate3d(0px, 0px, 0px)';
  public scrollNum: number;
  private destroyed$ = new Subject();
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

  readonly _height = computed<number>(
    () => (this.autoSize() ? this._calcHeight() : this.height()) || 0,
  );
  private _calcHeight = toSignal(
    fromEvent(window, 'resize').pipe(
      startWith(null),
      debounceTime(20), // ~1 animation frame
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
    ),
  );
  readonly bodyHeight = computed<number>(() => {
    if (!this._height() || !this.body()) return 0;

    const hasHeader =
      !this._responsive() || (this._responsive() && !this.smallScreen());
    const hasFooter =
      this.footerRow &&
      (!this._responsive() || (this._responsive() && !this.smallScreen()));
    const hasHeaderGroup =
      (!this._responsive() || (this._responsive() && !this.smallScreen())) &&
      this.columnGroups()?.length;
    const headerOffset = hasHeader ? this.headerHeight() : 0;
    const actionsHeight = this.actions() ? this.actions()!.height() : 0;
    let footerOffset = 0;
    if (hasFooter && this.footerRow instanceof Array) {
      footerOffset = this.rowHeight() * this.footerRow.length;
    } else if (hasFooter) {
      footerOffset = this.rowHeight();
    }
    const groupOffset = hasHeaderGroup ? this.headerHeight() : 0;
    return (
      this._height() - headerOffset - footerOffset - groupOffset - actionsHeight
    );
  });

  width = computed(() => {
    if (this.scrollbarH() && this._columns()) {
      const widthOffset =
        this.bodyHeight() && this.rowTotalHeight > this.bodyHeight() ? 12 : 0;
      return `${this.columnTotalWidth() + widthOffset}px`;
    }
    return 'auto';
  });

  private _rows: T[];
  private _internalRows: T[];

  get rows() {
    return this._internalRows;
  }

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input()
  set rows(rows: T[]) {
    this._rows = rows;

    this.rowTotalHeight = (rows || []).length * this.rowHeight();

    if (rows && rows.length > 0) {
      this._internalRows = [...(rows || [])];
      const externalSort = this.externalSort();
      if (!this.preserveSort() && !externalSort) {
        this.activeSort.set(null);
      }

      if (this.activeSort() && !externalSort) {
        const column = (this._columns() || []).find(
          (col) => col.$$id === this.activeSort()?.active,
        );
        if (column && this.activeSort()) {
          this.sort(this.activeSort() as Sort);
        }
      }
    } else {
      this._internalRows = [];
    }
  }

  private _footerRow: T;

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input('footerRow')
  get footerRow() {
    if (this._footerRow && typeof this._footerRow === 'object') {
      if (this._footerRow instanceof Array) {
        return this._footerRow;
      }
      return [this._footerRow];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set footerRow(row: any) {
    this._footerRow = row;
  }

  readonly columns = input<Column[]>([]);
  public _columns = linkedSignal<Column[]>(() => {
    if (this.columns() == null || this.columns().length === 0) {
      return [];
    }
    const columns = this.columns().map((column, index) => ({
      ...column,
      $$id: btoa(`${column.prop}${column.name}${index}`),
      flexShrink: this.resizeable() ? 0 : column.flexShrink,
      flexGrow: this.resizeable() ? 0 : column.flexGrow,
    }));
    return columns;
  });
  public columnTotalWidth = computed(() =>
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
        .pipe(takeUntil(this.destroyed$))
        .subscribe((width) =>
          this.smallScreen.set(width < this.responsiveBreakPoint()),
        );
    }
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public scrollTo(item: T | number, behaviour: ScrollBehavior = 'smooth') {
    if (this.body().vScroller()) {
      if (typeof item === 'number') {
        this.scrollToIndex(item, behaviour);
      } else {
        const index = this.rows.indexOf(item);
        if (index >= 0) {
          this.scrollToIndex(index, behaviour);
        }
      }
    }
  }

  setHeaderScroll(event: Event) {
    const left = (event.target as HTMLElement).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
    this.cdr.detectChanges();
  }

  scrollBodyAndHeader(event: Event) {
    const left = (event.target as HTMLElement).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
  }

  sort(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this._internalRows = [...(this._rows || [])];
      this.activeSort.set(null);
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
    const fn = column.sortFn || this.defaultSortFn;
    this._internalRows = [...(this._rows || [])].sort((a, b) => {
      const n = fn(a, b, column);
      return n * (sort.direction === 'asc' ? 1 : -1);
    });
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onResize({ column }: { columns: Column[]; column: Column }) {
    this._columns.set(
      [...this._columns()].map((c) => {
        // Disallow grow/shrink if resizing
        c.flexGrow = 0;
        c.flexShrink = 0;
        return c;
      }),
    );

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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Column, ColumnDisplay, ColumnGroup, Group } from './columns';
import { HeaderContextMenu, RowActivation, RowContextMenu, RowSelection } from './events';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { SelectionModes } from './selection-modes';
import { rowClassFn } from './models';
import { StoDatatableActionsComponent } from './sto-datatable-actions/sto-datatable-actions.component';
import { Sort } from '@angular/material/sort';
import { observeWidth } from './observer';

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: [ './sto-datatable.component.scss', './sto-datatable-progress-bar.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoDatatableComponent<T extends Record<string, unknown>> implements AfterViewInit, OnDestroy {
  private destroyed$ = new Subject();

  @Input()
  get height() {
    return this._height;
  }

  set height(height: number) {
    this._height = height;
    if ( !this.autoSize ) {
      this.height$ = of(height);
    }
  }

  get bodyHeight() {
    if ( !this.height || !this.body ) {
      return null;
    }
    const hasHeader = !this.responsive || ( this.responsive && !this.smallScreen );
    const hasFooter = this.footerRow && ( !this.responsive || ( this.responsive && !this.smallScreen ) );
    const hasHeaderGroup = ( !this.responsive || ( this.responsive && !this.smallScreen ) ) && this.columnGroups;
    const headerOffset = hasHeader ? this.headerHeight : 0;
    const actionsHeight = this.actions ? this.actions.height : 0;
    let footerOffset = 0;
    if ( hasFooter && this.footerRow instanceof Array ) {
      footerOffset = this.rowHeight * this.footerRow.length;
    } else if ( hasFooter ) {
      footerOffset = this.rowHeight;
    }
    const groupOffset = hasHeaderGroup ? this.headerHeight : 0;
    return this.height - headerOffset - footerOffset - groupOffset - actionsHeight;
  }

  @Input()
  set rows(rows: T[]) {
    this._rows = rows;
    let sortedRows = [ ...( rows || [] ) ];
    if ( !this.preserveSort ) {
      this.activeSort = null;
    }

    if ( this.activeSort ) {
      const column = this.columns.find(col => col.$$id === this.activeSort?.active);
      const sortDir = this.activeSort.direction;
      if ( column ) {
        const fn = column.sortFn || this.defaultSortFn;
        sortedRows = [ ...rows ].sort((a, b) => fn(a, b, column));
        if ( sortDir === 'desc' ) {
          sortedRows.reverse();
        }
      }
    }

    this.rowTotalHeight = ( rows || [] ).length * this.rowHeight;
    this._internalRows = [ ...( sortedRows || [] ) ];
  }

  get rows() {
    return this._internalRows;
  }

  @Input('footerRow')
  get footerRow() {
    if ( this._footerRow && typeof this._footerRow === 'object' ) {
      if ( this._footerRow instanceof Array ) {
        return this._footerRow;
      }
      return [ this._footerRow ];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set footerRow(row: any) {
    this._footerRow = row;
  }

  @Input()
  get columnMode(): ColumnDisplay {
    return this._columnMode || ColumnDisplay.Flex;
  }

  set columnMode(columnMode: ColumnDisplay) {
    this._columnMode = columnMode;
  }

  @Input()
  get columns(): Column[] {
    return this._columns;
  }

  set columns(columns: Column[]) {
    if ( columns ) {
      this._columns = columns
        .map((column, index) => ( {
          ...column,
          $$id: btoa(`${column.prop}${column.name}${index}`)
        } ));
      this.columnTotalWidth = columns.map(c => c.flexBasis || 80).reduce((a, b) => a + b, 0);
    }
  }

  @Input()
  groups: Array<Group>;

  get width() {
    if ( this.scrollbarH && this.columns ) {
      const widthOffset = this.bodyHeight && this.rowTotalHeight > this.bodyHeight ? 12 : 0;
      return `${this.columnTotalWidth + widthOffset}px`;
    }
    return 'auto';
  }

  @ViewChild(StoDatatableBodyComponent)
  body: StoDatatableBodyComponent<T>;
  @ContentChild(StoDatatableActionsComponent)
  actions: StoDatatableActionsComponent;
  @Input()
  rowHeight = 36;
  @Input()
  scrollbarH: boolean;
  @Input()
  emptyMessage = `No records in set`;
  @Input()
  headerHeight = 24;
  @Input()
  selectionMode: SelectionModes = SelectionModes.Click;
  @Input()
  sortable: boolean;
  @Input()
  disableRipple: boolean;

  ColumnDisplay = ColumnDisplay;

  private _height: number;
  @Input()
  loading: boolean;
  public height$: Observable<number>;
  public rowTotalHeight: number;

  @Input()
  autoSize: boolean;
  @Input()
  autoSizeOffset = 0;
  @Input()
  preserveSort: boolean;

  private _rows: T[];
  private _internalRows: T[];
  @Input()
  selected: T;

  private _footerRow: T;

  @Input()
  virtualScroll = true;

  private _columnMode: ColumnDisplay;

  @Input()
  responsive: boolean;
  @Input()
  responsiveView: TemplateRef<unknown>;
  @Input()
  responsiveBreakPoint = 400;
  public smallScreen = false;

  @Input()
  rowClass: rowClassFn;

  @HostBinding('class.mat-elevation-z3')
  @Input()
  elevation = true;

  @Input()
  columnGroups: ColumnGroup[];

  private _columns: Column[];
  @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
  select = new EventEmitter<RowSelection<T>>();
  @Output()
  resized = new EventEmitter<Column>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  rowActivate = new EventEmitter<RowActivation<T>>();
  @Input()
  resizeable: boolean;

  private resizeTimeout: number | undefined;
  public columnTotalWidth: number;

  public scrollLeft = 'translate3d(0px, 0px, 0px)';
  public scrollNum: number;
  public activeSort: Sort | null;

  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef, private zone: NgZone) {
  }


  @Input()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackBy = (index: number, item: T) => {
    return index;
  };

  rowClick(row: T, index: number, event: MouseEvent) {
    this.selected = row;
    this.select.emit({ row, index, event });
  }

  trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  ngAfterViewInit() {
    if ( this.autoSize ) {
      this.setAutoSize();
    }
    if ( this.responsive && !this.responsiveView ) {
      console.error('Responsive mode set to true, but no view passed in. Please pass in responsiveView (templateRef)');
      this.responsive = false;
    } else if ( this.responsive ) {
      observeWidth(this.elRef.nativeElement)
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe(width => {
        this.zone.run(() => {
          this.smallScreen = width < this.responsiveBreakPoint;
          this.cdr.markForCheck();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if ( this.resizeTimeout ) {
      clearTimeout(this.resizeTimeout);
    }
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  private scrollToIndex(index: number, behaviour: ScrollBehavior) {
    if ( this.body.vScroller ) {
      this.body.vScroller.scrollToIndex(index, behaviour);
    }
  }

  public scrollTo(item: T | number, behaviour: ScrollBehavior = 'smooth') {
    if ( this.body.vScroller ) {
      if ( typeof item === 'number' ) {
        this.scrollToIndex(item, behaviour);
      } else {
        const index = this.rows.indexOf(item);
        if ( index >= 0 ) {
          this.scrollToIndex(index, behaviour);
        }
      }
    }
  }

  private setAutoSize() {
    const el = this.elRef.nativeElement as HTMLElement;
    this.height$ = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        debounceTime(20), // ~1 animation frame
        map(() => el.getBoundingClientRect()),
        map(rect => rect.top),
        map(top => window.innerHeight - top - 16 - this.autoSizeOffset - ( this.actions ? 6 : 0 )),
        tap(height => this.height = height)
      );
  }

  setHeaderScroll(event: Event) {
    const left = ( event.target as HTMLElement ).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
    this.cdr.detectChanges();
  }

  scrollBodyAndHeader(event: Event) {
    const left = ( event.target as HTMLElement ).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
  }

  sort(sort: Sort) {
    if ( !sort.active || sort.direction === '' ) {
      this._internalRows = [ ...this._rows ];
      this.activeSort = null;
      return;
    }
    this.activeSort = sort;
    const column = this.columns.find(c => c.$$id === sort.active);
    if ( !column ) {
      return;
    }
    const fn = column.sortFn || this.defaultSortFn;
    this._internalRows = [ ...this._rows ].sort((a, b) => {
      const n = fn(a, b, column);
      return n * ( sort.direction === 'asc' ? 1 : -1 );
    });
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  private defaultSortFn(a: T, b: T, col: Column) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const aValue = a[ col.prop ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bValue = b[ col.prop ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return aValue === bValue ? 0 : aValue < bValue ? -1 : 1;
  }

  onResize({ columns, column }: { columns: Column[], column: Column }) {
    this.columns = [ ...columns ]
      .map(c => {
        // Disallow grow/shrink if resizing
        c.flexGrow = 0;
        c.flexShrink = 0;
        return c;
      });
    this.resized.emit(column);
  }
}

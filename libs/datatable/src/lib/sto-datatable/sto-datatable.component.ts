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
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Column, ColumnDisplay, ColumnGroup } from './columns';
import { HeaderContextMenu, RowActivation, RowContextMenu, RowSelection } from './events';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { SelectionModes } from './selection-modes';
import { rowClassFn, SortColumn } from './models';
import { StoDatatableActionsComponent } from './sto-datatable-actions/sto-datatable-actions.component';

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: [ './sto-datatable.component.scss', './sto-datatable-progress-bar.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoDatatableComponent<T extends Record<string, unknown>> implements AfterViewInit, OnDestroy {

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
    let sortedRows = [...(rows || [])];
    if (!this.preserveSort) {
      this.activeSort = null;
    }

    if (this.activeSort) {
      const column = this.columns.find(col => col.$$id === this.activeSort?.id);
      const sortDir = this.activeSort.sortDir;
      if (column) {
          const fn = column.sortFn || this.defaultSortFn;
          sortedRows = [ ...rows ].sort((a, b) => fn(a, b, column));
        if ( sortDir === 'desc' ) {
          sortedRows.reverse();
        }
      }
    }

    this.rowTotalHeight = ( rows || [] ).length * this.rowHeight;
    this._internalRows = [...( sortedRows || [] )];
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
  public smallScreen: boolean;

  @Input()
  rowClass: rowClassFn;

  @HostBinding('class.mat-elevation-z3')
  @Input()
  elevation = true;

  @Input()
  columnGroups: ColumnGroup[];

  private _columns: Column[];
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
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
  public activeSort: SortColumn | null;

  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef) {
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
      new ResizeObserver(entries => {
        if ( this.resizeTimeout ) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
          for ( const entry of entries ) {
            const cr = entry.contentRect;
            const { width } = cr;
            const smallScreen = width < this.responsiveBreakPoint;
            if ( this.smallScreen !== smallScreen ) {
              this.smallScreen = smallScreen;
              requestAnimationFrame(() => {
                try {
                  this.cdr.markForCheck();
                  this.cdr.detectChanges();
                } catch { /** them all */
                }
              });
            }
          }
        }, 15);
      }).observe(this.elRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if ( this.resizeTimeout ) {
      clearTimeout(this.resizeTimeout);
    }
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
    const left = (event.target as HTMLElement).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
    this.cdr.detectChanges();
  }

  scrollBodyAndHeader(event: Event) {
    const left = (event.target as HTMLElement).scrollLeft;
    this.scrollLeft = `translate3d(-${left}px, 0px, 0px)`;
  }

  sort({ column, sortDir }: { column: Column, sortDir: 'asc' | 'desc' | null }) {
    if ( sortDir === null ) {
      this._internalRows = [ ...this._rows ];
      this.activeSort = null;
      return;
    }
    this.activeSort = { id: column.$$id || '', sortDir };
    const fn = column.sortFn || this.defaultSortFn;
    const rows = [ ...this._rows ].sort((a, b) => fn(a, b, column));
    if ( sortDir === 'desc' ) {
      rows.reverse();
    }
    this._internalRows = rows;
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
    switch ( typeof aValue ) {
      case 'string':
        return aValue.localeCompare(bValue as string);
      case 'number':
        return aValue - (bValue as number);
      default:
        return 0;
    }
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

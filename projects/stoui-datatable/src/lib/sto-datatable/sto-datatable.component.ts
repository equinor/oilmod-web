import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { Column, ColumnGroup } from './columns';
import { HeaderContextMenu, RowActivation, RowContextMenu, RowSelection } from './events';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { SelectionModes } from './selection-modes';

declare var ResizeObserver: any;

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: [ './sto-datatable.component.scss', './sto-datatable-progress-bar.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoDatatableComponent<T = any> implements AfterViewInit, OnDestroy {
  @ViewChild(StoDatatableBodyComponent, { static: true })
  body: StoDatatableBodyComponent;
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
  get height() {
    return this._height;
  }

  set height(height: number) {
    this._height = height;
    if ( !this.autoSize ) {
      this.height$ = of(height);
    }
  }

  private _height: number;
  @Input()
  loading: boolean;
  public height$: Observable<number>;

  get bodyHeight() {
    if ( !this.height ) {
      return null;
    }
    const hasHeader = !this.responsive || ( this.responsive && !this.smallScreen );
    const hasFooter = this.footerRow && ( !this.responsive || ( this.responsive && !this.smallScreen ) );
    const hasHeaderGroup = ( !this.responsive || ( this.responsive && !this.smallScreen ) ) && this.columnGroups;
    const headerOffset = hasHeader ? this.headerHeight : 0;
    const footerOffset = hasFooter && !this.body.horizontalScrollActive ? this.rowHeight : 0;
    const groupOffset = hasHeaderGroup ? this.headerHeight : 0;
    return this.height - headerOffset - footerOffset - groupOffset;
  }

  @Input()
  autoSize: boolean;
  @Input()
  autoSizeOffset = 0;

  @Input()
  rows: T[];
  @Input()
  selected: T;
  @Input('footerRow')
  _footerRow: T;
  get footerRow() {
    if ( this._footerRow && typeof this._footerRow === 'object' ) {
      if ( this._footerRow instanceof Array ) {
        return this._footerRow;
      }
      return [ this._footerRow ];
    }
  }

  @Input()
  virtualScroll = true;

  @Input()
  responsive: boolean;
  @Input()
  responsiveView: TemplateRef<any>;
  @Input()
  responsiveBreakPoint = 400;
  public smallScreen: boolean;

  @Input()
  rowClass: Function;

  @HostBinding('class.mat-elevation-z3')
  @Input()
  elevation = true;

  @Input()
  get columns(): Column[] {
    return this._columns;
  }

  set columns(columns: Column[]) {
    if ( columns ) {
      this._columns = columns
        .map(column => ( {
          ...column,
          $$id: btoa(`${column.prop}${column.name}`)
        } ));
    }
  }

  @Input()
  columnGroups: ColumnGroup[];

  private _columns: Column[];
  @Output()
  select = new EventEmitter<RowSelection<T>>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  rowActivate = new EventEmitter<RowActivation<T>>();

  private resizeTimeout;

  get width() {
    if ( this.scrollbarH && this.columns ) {
      const widthOffset = this.bodyHeight && ( this.rows || [] ).length * this.rowHeight > this.bodyHeight ? 12 : 0;
      const width = this.columns.map(col => col.flexBasis || 80).reduce((a, b) => a + b, 0);
      return `${width + widthOffset}px`;
    }
    return 'auto';
  }

  public scrollLeft = 'translate3d(0px, 0px, 0px)';
  public scrollNum: number;
  @Input()
  trackBy = (item: T, index: number) => {
    return index;
  };

  rowClick(row: T, index: number, event: MouseEvent) {
    this.selected = row;
    this.select.emit({ row, index, event });
  }

  trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef) {
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
        map(top => window.innerHeight - top - 16 - this.autoSizeOffset),
        tap(height => this.height = height)
      );
  }

  setHeaderScroll(event: any) {
    const left = event.target.scrollLeft;
    const str = `translate3d(-${left}px, 0px, 0px)`;
    this.scrollLeft = str;
    this.cdr.detectChanges();
  }
}

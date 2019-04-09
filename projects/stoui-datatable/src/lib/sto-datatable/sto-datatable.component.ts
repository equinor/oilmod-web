import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Column } from './columns';
import { HeaderContextMenu, RowContextMenu, RowSelection } from './events';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';

declare var ResizeObserver: any;

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: [ './sto-datatable.component.scss', './sto-datatable-progress-bar.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoDatatableComponent<T = any> implements AfterViewInit {
  @ViewChild(StoDatatableBodyComponent)
  body: StoDatatableBodyComponent;
  @Input()
  rowHeight = 36;
  @Input()
  emptyMessage = `No records in set`;
  @Input()
  headerHeight = 24;
  @Input()
  height;
  @Input()
  loading: boolean;
  get bodyHeight() {
    if ( !this.height ) {
      return null;
    }
    const hasHeader = !this.responsive || ( this.responsive && !this.smallScreen );
    const hasFooter = this.footerRow && ( !this.responsive || ( this.responsive && !this.smallScreen ) );
    const headerOffset = hasHeader ? this.headerHeight : 0;
    const footerOffset = hasFooter ? this.rowHeight : 0;
    return this.height - headerOffset - footerOffset;
  }

  @Input()
  rows: T[];
  @Input()
  selected: T;
  @Input()
  footerRow: T;
  @Input()
  virtualScroll = true;
  @Input()
  trackBy = (item: T, index: number) => {
    return index;
  };

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

  private _columns: Column[];
  @Output()
  select = new EventEmitter<RowSelection<T>>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  private resizeTimeout;

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
                this.cdr.markForCheck();
                this.cdr.detectChanges();
              });
            }
          }
        }, 15);
      }).observe(this.elRef.nativeElement);
    }
  }

  private scrollToIndex(index: number, behaviour: ScrollBehavior) {
    if ( this.body.scroller ) {
      this.body.scroller.scrollToIndex(index, behaviour);
    }
  }

  public scrollTo(item: T | number, behaviour: ScrollBehavior = 'smooth') {
    if ( this.body.scroller ) {
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

}

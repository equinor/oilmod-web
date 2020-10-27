import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column, ColumnDisplay } from '../columns';
import { HeaderContextMenu } from '../events';
import { animate, state, style, transition, trigger, } from '@angular/animations';

@Component({
  selector: 'sto-datatable-header',
  templateUrl: './sto-datatable-header.component.html',
  styleUrls: ['./sto-datatable-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sort', [
      state('open', style({ width: '16px', opacity: 1 })),
      transition('void => *', [
        style({ width: 0, overflow: 'hidden', opacity: 0 }),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({ width: 0, overflow: 'hidden', opacity: 0 }))
      ])
    ])
  ]
})
export class StoDatatableHeaderComponent<T = any> implements OnInit {
  @Input()
  responsive: boolean;
  @Input()
  smallScreen: boolean;
  @Input()
  headerHeight: number;
  @Input()
  resizeable: boolean;
  @Input()
  width: string;
  @Input()
  offset: number;
  @Input()
  scrollLeft: string;
  @Input()
  bodyHeight: number;
  @Input()
  rows: T[];
  @Input()
  rowHeight: number;
  @Input()
  columns: Column[];
  @Input()
  sortable: boolean;
  @Input()
  activeSortId: string;
  @Input()
  columnMode: ColumnDisplay;
  ColumnDisplay = ColumnDisplay;
  public tempWidth: string;

  public headerWidthMap = {};

  @Output()
  resized = new EventEmitter<{ columns: Column[], column: Column }>();

  public sortDirection: 'asc' | 'desc' | null;


  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  sort = new EventEmitter<{ column: Column, sortDir: 'asc' | 'desc' | null }>();

  constructor() {
  }

  ngOnInit() {
  }

  public trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  sortByColumn(column: Column) {
    if ( !this.sortable || column.disableSort ) {
      return;
    }
    if ( column.$$id === this.activeSortId && this.sortDirection === 'desc' ) {
      this.sortDirection = null;
    } else if ( column.$$id === this.activeSortId && this.sortDirection === 'asc' ) {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sort.emit({ column, sortDir: this.sortDirection });
  }

  public onResize(column: Column, flexBasis: number): void {
    let width = 0;
    const colIndex = this.columns.indexOf(column);
    this.headerWidthMap[ colIndex ] = flexBasis;
    console.log(this.headerWidthMap[ colIndex ]);
    /*    const cols = this.columns
          .map(c => {
            if ( c === column ) {
              c.flexBasis = flexBasis;
            }
            width = width + c.flexBasis;
            return c;
          });*/
    this.tempWidth = ( this.offset + width ) + 'px';
    // this.columns = [...cols];
  }

  onResizeEnd(col: Column, flexBasis: number) {
    // this.onResize(column, flexBasis);
    const columns = this.columns
      .map(c => {
        if ( c === col ) {
          return {
            ...c,
            flexBasis
          };
        }
        return c;
      });
    this.tempWidth = null;
    const column = { ...col, flexBasis };
    this.resized.emit({ columns, column });
  }
}

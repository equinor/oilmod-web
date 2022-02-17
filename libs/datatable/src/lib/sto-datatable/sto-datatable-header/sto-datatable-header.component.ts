import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Column, ColumnDisplay, Group } from '../columns';
import { HeaderContextMenu } from '../events';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'sto-datatable-header',
  templateUrl: './sto-datatable-header.component.html',
  styleUrls: ['./sto-datatable-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoDatatableHeaderComponent<T = Record<string, unknown>> {
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
  bodyHeight: number | null;
  @Input()
  rows: T[];
  @Input()
  rowHeight: number;
  @Input()
  columns: Column[];
  @Input()
  sortable: boolean;
  @Input()
  columnMode: ColumnDisplay;
  @Input()
  groups: Array<Group>;

  ColumnDisplay = ColumnDisplay;
  public tempWidth: string | null;

  public headerWidthMap: Record<number, number> = {};

  @Output()
  resized = new EventEmitter<{ columns: Column[], column: Column }>();

  public sortDirection: 'asc' | 'desc' | null;


  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  sort = new EventEmitter<Sort>();

  public trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  public onResize(column: Column, flexBasis: number): void {
    const width = 0;
    const colIndex = this.columns.indexOf(column);
    this.headerWidthMap[ colIndex ] = flexBasis;
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

  sortColumn(sortEvent: Sort) {
    this.sort.emit(sortEvent);
  }
}

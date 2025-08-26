import { CdkDragEnd, CdkDragMove, CdkDrag } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { Column, ColumnDisplay, Group } from '../columns';
import { HeaderContextMenu } from '../events';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ExecPipe } from '../exec.pipe';
import { ColumnStylePipe } from '../column-style.pipe';
import { GetGroupFlexPipe } from '../get-group-flex.pipe';

@Component({
    selector: 'sto-datatable-header',
    templateUrl: './sto-datatable-header.component.html',
    styleUrls: ['./sto-datatable-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'datatable-header',
    },
    imports: [MatSort, NgClass, NgStyle, MatSortHeader, NgTemplateOutlet, CdkDrag, ExecPipe, ColumnStylePipe, GetGroupFlexPipe]
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

  // Can be used to generate sticky columns at a later stage.
  get offsetLeft() {
    return this.scrollLeft.replace('-', '');
  }

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
  resized = new EventEmitter<{ columns: Column[]; column: Column }>();

  public sortDirection: 'asc' | 'desc' | null;

  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  sort = new EventEmitter<Sort>();
  @Input()
  activeSort: Sort;

  public trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  onResize(event: CdkDragMove<Column>) {
    const el = event.source.element.nativeElement;
    const cell = el.parentElement as HTMLDivElement;
    const distance = event.distance.x;
    const def = event.source.data;
    let flexBasis = (def.flexBasis ?? 80) + distance;
    flexBasis = flexBasis < 80 ? 80 : flexBasis;
    cell.style.flexBasis = `${flexBasis}px`;
  }

  onResizeComplete(event: CdkDragEnd<Column>) {
    const distance = event.distance.x;
    const col = event.source.data;
    const cell = event.source.element.nativeElement
      .parentElement as HTMLDivElement;
    let flexBasis = (col.flexBasis ?? 80) + distance;
    if (col.flexGrow || col.flexBasis) {
      flexBasis = cell.clientWidth;
    }
    flexBasis = flexBasis < 80 ? 80 : flexBasis;
    const columns = this.columns.map((c) => {
      if (c.prop === col.prop) {
        return {
          ...c,
          flexBasis,
          flexGrow: 0,
          flexShrink: 0,
        };
      }
      return c;
    });
    const column = { ...col, flexBasis, flexGrow: 0, flexShrink: 0 };
    this.resized.emit({ columns, column });
  }

  public _onResize(column: Column, flexBasis: number): void {
    const width = 0;
    const colIndex = this.columns.indexOf(column);
    this.headerWidthMap[colIndex] = flexBasis;
    /*    const cols = this.columns
          .map(c => {
            if ( c === column ) {
              c.flexBasis = flexBasis;
            }
            width = width + c.flexBasis;
            return c;
          });*/
    this.tempWidth = this.offset + width + 'px';
    // this.columns = [...cols];
  }

  onResizeEnd(col: Column, flexBasis: number) {
    // this.onResize(column, flexBasis);
    const columns = this.columns.map((c) => {
      if (c === col) {
        return {
          ...c,
          flexBasis,
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

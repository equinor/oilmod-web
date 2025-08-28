import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  input,
  output,
} from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ColumnStylePipe } from '../column-style.pipe';
import { Column, ColumnDisplay, Group } from '../columns';
import { HeaderContextMenu } from '../events';
import { ExecPipe } from '../exec.pipe';
import { GetGroupFlexPipe } from '../get-group-flex.pipe';

@Component({
  selector: 'sto-datatable-header',
  templateUrl: './sto-datatable-header.component.html',
  styleUrls: ['./sto-datatable-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-header',
  },
  imports: [
    MatSort,
    NgClass,
    NgStyle,
    MatSortHeader,
    NgTemplateOutlet,
    CdkDrag,
    ExecPipe,
    ColumnStylePipe,
    GetGroupFlexPipe,
  ],
})
export class StoDatatableHeaderComponent<T = Record<string, unknown>> {
  readonly responsive = input<boolean>();
  readonly smallScreen = input<boolean>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  headerHeight: number;
  readonly resizeable = input<boolean>();
  readonly width = input<string>();
  readonly offset = input<number>(0);
  readonly scrollLeft = input<string>('');

  // Can be used to generate sticky columns at a later stage.
  get offsetLeft() {
    return this.scrollLeft().replace('-', '');
  }

  readonly bodyHeight = input<number>(0);
  readonly rows = input<T[]>([]);
  readonly rowHeight = input<number>(0);
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  columns: Column[];
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  sortable: boolean;
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input()
  groups: Array<Group>;

  ColumnDisplay = ColumnDisplay;
  public tempWidth: string | null;

  public headerWidthMap: Record<number, number> = {};

  readonly resized = output<{
    columns: Column[];
    column: Column;
  }>();

  public sortDirection: 'asc' | 'desc' | null;

  readonly headerContextMenu = output<HeaderContextMenu>();
  readonly sort = output<Sort>();
  readonly activeSort = input<Sort | null>(null);

  @ViewChild(MatSort) private matSort: MatSort;
  @ViewChildren(MatSortHeader) private sortHeaders: QueryList<MatSortHeader>;

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
    this.tempWidth = this.offset() + width + 'px';
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

  onHeaderCellClick(id: string) {
    if (!this.sortable) {
      return;
    }
    const header = this.sortHeaders?.find((h) => h.id === id);
    if (header && this.matSort) {
      this.matSort.sort(header);
    }
  }
}

import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { StoRowWidthHelper } from '../../sto-row-width.helper';
import { ColumnStylePipe } from '../column-style.pipe';
import { Column, ColumnDisplay, Group } from '../columns';
import { HeaderContextMenu } from '../events';
import { ExecPipe } from '../exec.pipe';
import { GetGroupFlexPipe } from '../get-group-flex.pipe';

@Component({
  selector: 'sto-datatable-header',
  templateUrl: './sto-datatable-header.component.html',
  styleUrl: './sto-datatable-header.component.scss',
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
export class StoDatatableHeaderComponent<T extends object> {
  private readonly rowWidthHelper = inject(StoRowWidthHelper);

  // Display configuration
  readonly responsive = input<boolean>();
  readonly smallScreen = input<boolean>();
  readonly headerHeight = input<number>(0);
  readonly resizeable = input<boolean>();
  readonly width = input<string>();
  readonly offset = input<number>(0);
  readonly scrollLeft = input<string>('');
  readonly bodyHeight = input<number>(0);
  readonly rowHeight = input<number>(0);

  // Data configuration
  readonly rows = input<T[]>([]);
  readonly columns = input<Column[]>([]);
  readonly groups = input<Group[]>([]);

  // Feature flags
  readonly sortable = input<boolean>(false);
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);
  readonly activeSort = input<Sort | null>(null);

  // Outputs
  readonly resized = output<{ columns: Column[]; column: Column }>();
  readonly headerContextMenu = output<HeaderContextMenu>();
  readonly sort = output<Sort>();

  // View queries
  private readonly matSort = viewChild(MatSort);
  private readonly sortHeaders = viewChildren(MatSortHeader);

  // Public properties for template
  readonly ColumnDisplay = ColumnDisplay;
  readonly offsetLeft = computed(() => {
    const scroll = this.scrollLeft();
    return scroll.startsWith('-') ? scroll.substring(1) : scroll;
  });

  currentRowWidth = this.rowWidthHelper.currentRowWidth;

  // Temporary width for resize operations
  tempWidth: string | null = null;

  readonly trackColumnsFn = (
    _index: number,
    column: Column,
  ): string | undefined => column.$$id;

  onResize(event: CdkDragMove<Column>): void {
    const cell = event.source.element.nativeElement
      .parentElement as HTMLDivElement;
    const column = event.source.data;

    const flexBasis = (column.flexBasis ?? 80) + event.distance.x;

    cell.style.flexBasis = `${flexBasis}px`;
    cell.style.minWidth = `${flexBasis}px`;
  }

  onResizeComplete(event: CdkDragEnd<Column>): void {
    const MIN_COLUMN_WIDTH = 80;
    const col = event.source.data;
    const cell = event.source.element.nativeElement
      .parentElement as HTMLDivElement;

    const flexBasis = Math.max(
      col.flexGrow || col.flexBasis
        ? cell.clientWidth
        : (col.flexBasis ?? MIN_COLUMN_WIDTH) + event.distance.x,
      MIN_COLUMN_WIDTH,
    );

    const updatedColumn = { ...col, flexBasis, flexGrow: 0, flexShrink: 0 };
    const columns = this.columns().map((c) =>
      c.prop === col.prop ? updatedColumn : c,
    );

    this.resized.emit({ columns, column: updatedColumn });
  }

  onResizeEnd(col: Column, flexBasis: number): void {
    const updatedColumn = { ...col, flexBasis };
    const columns = this.columns().map((c) => (c === col ? updatedColumn : c));

    this.tempWidth = null;
    this.resized.emit({ columns, column: updatedColumn });
  }

  sortColumn(sortEvent: Sort): void {
    this.sort.emit(sortEvent);
  }

  onHeaderCellClick(id: string): void {
    if (!this.sortable()) return;

    const header = this.sortHeaders()?.find((h) => h.id === id);
    const sort = this.matSort();

    if (header && sort) {
      sort.sort(header);
    }
  }
}

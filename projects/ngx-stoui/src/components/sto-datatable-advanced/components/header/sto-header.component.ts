import { Component, Input } from '@angular/core';
import { columnGroupWidths, columnsByPin, columnsByPinArr, columnTotalWidth } from '../../../../vendor/ngx-datatable//utils';
import { ColumnGroup } from '../../types/column-header.type';
import { DataTableHeaderComponent } from '../../../../vendor/ngx-datatable/components/header/header.component';

@Component({
  selector: 'sto-complex-header',
  template: `
    <div
      orderable
      (reorder)="onColumnReordered($event)"
      [style.width.px]="columnGroupWidths.total"
      class="datatable-header-inner">

      <div
        *ngFor="let colGroup of columnsByPin; trackBy: trackByGroups"
        [class]="'datatable-row-' + colGroup.type"
        [ngStyle]="stylesByGroup(colGroup.type)">
        <div class="datatable-header-column-group" *ngIf="columnGroups">
          <div class="datatable-header-cell" style="display: inline-block"
               [ngClass]="columnGroup.headerClass"
               [style.width]="columnGroup.width+'px'" *ngFor="let columnGroup of
				         columnGroupByPin[colGroup.type]">
            <ng-container *ngIf="!columnGroup.headerTemplate">
              {{ columnGroup.name }}
            </ng-container>
            <ng-template #headerTemplate
                         *ngIf="columnGroup.headerTemplate"
                         [ngTemplateOutletContext]="{ columnGroup: columnGroup, $implicit: columnGroup }"
                         [ngTemplateOutlet]="columnGroup.headerTemplate">
            </ng-template>
          </div>
        </div>
        <!--removed from datatable-header-cell. issues with grouping-->
        <!--					  draggable
                    [dragModel]="column"
                    [dragEventTarget]="dragEventTarget"
                    [dragX]="reorderable && column.draggable && column.dragging"
                    [dragY]="false"-->
        <datatable-header-cell
          *ngFor="let column of colGroup.columns; trackBy: columnTrackingFn"
          resizeable
          [resizeEnabled]="column.resizeable"
          (resize)="onColumnResized($event, column)"
          long-press
          [pressModel]="column"
          [pressEnabled]="reorderable && column.draggable"
          (longPressStart)="onLongPressStart($event)"
          (longPressEnd)="onLongPressEnd($event)"
          [headerHeight]="headerHeight"
          [column]="column"
          [sortType]="sortType"
          [sorts]="sorts"
          [selectionType]="selectionType"
          [sortAscendingIcon]="sortAscendingIcon"
          [sortDescendingIcon]="sortDescendingIcon"
          [allRowsSelected]="allRowsSelected"
          (sort)="onSort($event)"
          (select)="select.emit($event)"
          (columnContextmenu)="columnContextmenu.emit($event)">
        </datatable-header-cell>
      </div>

    </div>
  `,
  host: {
    class: 'datatable-header'
  }
})
export class StoComplexDataTableHeaderComponent extends DataTableHeaderComponent {

  columnGroupByPin: any;
  columnGroupWidths: any;
  _columnGroups: ColumnGroup[];

  @Input() set innerWidth(val: number) {
    this._innerWidth = val;

    if (this._columns) {
      const colByPin = columnsByPin(this._columns);
      this.columnGroupWidths = columnGroupWidths(colByPin, this._columns);

      if (this._columnGroups) {
        this._columnGroups.forEach(
          columnGroup => {
            columnGroup.width = columnTotalWidth(columnGroup.columns);
          }
        );
      }
    }
  }

  get innerWidth(): number {
    return this._innerWidth;
  }


  @Input() set columns(val: any[]) {
    this._columns = val;

    const colsByPin = columnsByPin(val);
    this.columnsByPin = columnsByPinArr(val);
    this.columnGroupWidths = columnGroupWidths(colsByPin, val);
    if (this._columnGroups) {

      this._columnGroups.forEach(
        columnGroup => {
          columnGroup.width = columnTotalWidth(columnGroup.columns);
        }
      );
    }
  }

  setColumnHeaderDefaults(columnHeaders: ColumnGroup[]) {

    for (let ii = 0; ii < columnHeaders.length; ii++) {
      const columnHeader = columnHeaders[ii];
      if (this._columns) {
        columnHeader.columns = this._columns.filter(column => columnHeader.properties.indexOf(column.prop) > -1);
      }
    }
  }

  @Input() set columnGroups(val: any[]) {
    this._columnGroups = val;
    if (val) {
      this.setColumnHeaderDefaults(this._columnGroups);
      this._columnGroups.forEach(
        columnGroup => {
          columnGroup.width = columnTotalWidth(columnGroup.columns);
        }
      );
      this.columnGroupByPin = columnsByPin(val);
    }
  }

  get columnGroups(): any[] {
    return this._columnGroups;
  }


}

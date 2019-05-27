import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  KeyValueDiffers,
  Output
} from '@angular/core';

import { DataTableBodyRowComponent } from '../../../vendor/ngx-datatable/components/body/body-row.component';
import { ScrollbarHelper } from '../../../vendor/ngx-datatable/services/scrollbar-helper.service';

@Component({
  selector: 'sto-datatable-body-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngFor="let colGroup of columnsByPin; let i = index; trackBy: trackByGroups"
      class="datatable-row-{{colGroup.type}} datatable-row-group"
      [ngStyle]="stylesByGroup(colGroup.type)">
      <sto-datatable-body-cell
        *ngFor="let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn"
        tabindex="-1"
        [attr.prop]="column.prop"
        [row]="row"
        [group]="group"
        [expanded]="expanded"
        (contextmenu)="rowContextMenu.emit({ event: $event, row: row, type: 'cell', value: row[column.prop], column: column })"
        [isSelected]="isSelected"
        [rowIndex]="rowIndex"
        [column]="column"
        [rowHeight]="rowHeight"
        (activate)="onActivate($event, ii)">
      </sto-datatable-body-cell>
    </div>
  `
})
export class StoDataTableBodyRowComponent extends DataTableBodyRowComponent implements DoCheck {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetRow = event.target === this.element;

    if (isTargetRow) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        rowElement: this.element
      });
    }
  }

  @Output()
  rowContextMenu = new EventEmitter<{ event: MouseEvent; row: any; column: any; value: any; type: 'cell' }>();

  constructor(
    protected differs: KeyValueDiffers,
    protected scrollbarHelper: ScrollbarHelper,
    protected cd: ChangeDetectorRef,
    element: ElementRef) {
    super(differs, scrollbarHelper, cd, element);
  }
}

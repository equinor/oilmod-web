import {
  Component, ElementRef, KeyValueDiffers,
  HostListener, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, Input
} from '@angular/core';

import { DataTableBodyRowComponent } from '../../../../vendor/ngx-datatable/components/body/body-row.component';
import { ScrollbarHelper } from '../../../../vendor/ngx-datatable/services/scrollbar-helper.service';
import { Key } from '../../../shared/abstract-and-interfaces/keyPress.enum';

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

    const isAction =
      keyCode === Key.Enter ||
      keyCode === Key.DownArrow ||
      keyCode === Key.UpArrow ||
      keyCode === Key.K ||
      keyCode === Key.J ||
      keyCode === Key.LeftArrow ||
      keyCode === Key.RightArrow;

    if (isAction && isTargetRow) {
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

  constructor(
    protected differs: KeyValueDiffers,
    protected scrollbarHelper: ScrollbarHelper,
    protected cd: ChangeDetectorRef,
    element: ElementRef) {
    super(differs, scrollbarHelper, cd, element);
  }
}

import {
  Component, Input, HostBinding, ElementRef, Output, KeyValueDiffers, KeyValueDiffer,
  EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck
} from '@angular/core';

import { DataTableBodyRowComponent } from '../../../../vendor/ngx-datatable/components/body/body-row.component';
import { ScrollbarHelper } from '../../../../vendor/ngx-datatable/services/scrollbar-helper.service';

@Component({
  selector: 'sto-datatable-body-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngFor="let colGroup of columnsByPin; let i = index; trackBy: trackByGroups"
      class="datatable-row-{{colGroup.type}} datatable-row-group"
      [ngStyle]="stylesByGroup(colGroup.type)">
      <datatable-body-cell
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
      </datatable-body-cell>
    </div>      
  `
})
export class StoDataTableBodyRowComponent extends DataTableBodyRowComponent implements DoCheck {
  constructor(
    protected differs: KeyValueDiffers,
    protected scrollbarHelper: ScrollbarHelper,
    protected cd: ChangeDetectorRef,
    element: ElementRef) {
    super(differs, scrollbarHelper, cd, element);
  }
}

import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { DataTableBodyCellComponent } from '../../../vendor/ngx-datatable/components/body/body-cell.component';
import { Key } from '@ngx-stoui/core';

@Component({
  selector: 'sto-datatable-body-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
	  <div class="datatable-body-cell-label">
		  <label
				  *ngIf="column.checkboxable"
				  class="datatable-checkbox">
			  <input
					  type="checkbox"
					  [checked]="isSelected"
					  (click)="onCheckboxChange($event)"
			  />
		  </label>
		  <span
				  *ngIf="!column.cellTemplate"
				  [title]="sanitizedValue"
				  [innerHTML]="value">
		  </span>
		  <ng-template #cellTemplate
					   *ngIf="column.cellTemplate"
					   [ngTemplateOutlet]="column.cellTemplate"
					   [ngTemplateOutletContext]="cellContext">
		  </ng-template>
	  </div>
  `
})
export class StoDataTableBodyCellComponent extends DataTableBodyCellComponent {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetCell = event.target === this._element;

    const isAction =
      keyCode === Key.Enter ||
      keyCode === Key.DownArrow ||
      keyCode === Key.UpArrow ||
      keyCode === Key.J ||
      keyCode === Key.K ||
      keyCode === Key.LeftArrow ||
      keyCode === Key.RightArrow;

    if (isAction && isTargetCell) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        group: this.group,
        rowHeight: this.rowHeight,
        column: this.column,
        value: this.value,
        cellElement: this._element
      });
    }
  }
}

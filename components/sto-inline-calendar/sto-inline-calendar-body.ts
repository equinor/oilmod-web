import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatCalendarBody } from '@angular/material';
import { isAfter, isSameDay, isBefore, parse } from 'date-fns';

@Component({
  selector: '[sto-calendar-body]',
  template: `
	  <tr *ngFor="let row of rows; let rowIndex = index" #rowElement role="row">
		  <td *ngIf="rowIndex === 0 && _firstRowOffset"
			  aria-hidden="true" class="mat-calendar-body-label"
			  [attr.colspan]="_firstRowOffset" [style.paddingTop.%]="50 * cellAspectRatio / numCols"
			  [style.paddingBottom.%]="50 * cellAspectRatio / numCols">
		  </td>
		  <td *ngFor="let item of row; let colIndex = index"
			  role="gridcell" class="mat-calendar-body-cell"
			  [tabindex]="_isActiveCell(rowIndex, colIndex) ? 0 : -1"
			  [class.mat-calendar-body-disabled]="!item.enabled"
			  [class.mat-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"
			  [attr.aria-label]="item.ariaLabel"
			  [attr.aria-disabled]="!item.enabled || null" (click)="_cellClicked(item, $event)"
			  [style.width.%]="100 / numCols" [style.paddingTop.%]="50 * cellAspectRatio / numCols"
			  [style.paddingBottom.%]="50 * cellAspectRatio / numCols">
			  <div class="mat-calendar-body-cell-content"
				   [class.mat-calendar-body-selected]="selectedValue === item.value || isActive(item.ariaLabel)"
				   [class.mat-calendar-body-today]="todayValue === item.value">
				  {{item.displayValue}}
			  </div>
		  </td>
	  </tr>`,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'mat-calendar-body',
    'role': 'grid',
    'attr.aria-readonly': 'true'
  },
  styleUrls: ['./sto-inline-calendar-body.scss']
})
export class StoDatepickerCalendarBodyComponent extends MatCalendarBody {
  @Input() endDate: Date;
  @Input() startDate: Date;
  @Input() selectedDate: Date;

  /**
   * Determines if the cell should be highlighted (if it is within a range)
   * @param cellLabel
   */
  public isActive(cellLabel: string) {
    const check = parse(cellLabel);
    return this.endDate ? this.endCheck(check) : this.startDate ? this.startCheck(check) : false;
  }

  /**
   * Checks if the cell date is after the selected date.
   * @param date
   */
  private endCheck(date: Date): boolean {
    return isAfter(date, this.selectedDate) && (isSameDay(date, this.endDate) || isBefore(date, this.endDate));
  }


  /**
   * Checks if the cell date is before the selected date.
   * @param date
   */
  private startCheck(date: Date): boolean {
    return isBefore(date, this.selectedDate) && (isSameDay(date, this.startDate) || isAfter(date, this.startDate));
  }
}

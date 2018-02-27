import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, Optional,
  ViewEncapsulation
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatCalendar, MatDateFormats, MatDatepickerIntl } from '@angular/material';

@Component({
  selector: 'sto-inline-datepicker',
  template: `
	  <div class="mat-calendar-header">
		  <div class="mat-calendar-controls">
			  <button mat-button class="mat-calendar-period-button" (click)="_currentPeriodClicked()"
					  [attr.aria-label]="_periodButtonLabel">{{_periodButtonText}}
				  <div class="mat-calendar-arrow" [class.mat-calendar-invert]="_currentView != 'month'"></div>
			  </button>
			  <div class="mat-calendar-spacer"></div>
			  <button mat-icon-button class="mat-calendar-previous-button"
					  [disabled]="!_previousEnabled()" (click)="_previousClicked()"
					  [attr.aria-label]="_prevButtonLabel"></button>
			  <button mat-icon-button class="mat-calendar-next-button" [disabled]="!_nextEnabled()"
					  (click)="_nextClicked()" [attr.aria-label]="_nextButtonLabel"></button>
		  </div>
	  </div>
	  <div class="mat-calendar-content" (keydown)="_handleCalendarBodyKeydown($event)"
		   [ngSwitch]="_currentView" cdkMonitorSubtreeFocus tabindex="-1">
		  <sto-month-view *ngSwitchCase="'month'" [activeDate]="_activeDate"
						  [endDate]="endDate" [startDate]="startDate"
						  [selected]="selected" [dateFilter]="dateFilter" [maxDate]="maxDate"
						  [minDate]="minDate" (selectedChange)="_dateSelected($event)"
						  (_userSelection)="_userSelected()"></sto-month-view>
		  <mat-year-view *ngSwitchCase="'year'" [activeDate]="_activeDate"
						 [selected]="selected" [dateFilter]="dateFilter" [maxDate]="maxDate"
						 [minDate]="minDate" (selectedChange)="_goToDateInView($event, 'month')"></mat-year-view>
		  <mat-multi-year-view *ngSwitchCase="'multi-year'" [activeDate]="_activeDate"
							   [selected]="selected" [dateFilter]="dateFilter" [maxDate]="maxDate"
							   [minDate]="minDate" (selectedChange)="_goToDateInView($event, 'year')"></mat-multi-year-view>
	  </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [`./sto-inline-calendar.scss`],
  host: {
    'class': 'mat-calendar sto-calendar__inline',
  }
})
export class StoInlineCalendarComponent extends MatCalendar<Date> {
  @Input() endDate: Date;
  @Input() startDate: Date;
  constructor(_elementRef: ElementRef, _intl: MatDatepickerIntl
    , _ngZone: NgZone, _dateAdapter: DateAdapter<Date>
    , @Optional() @Inject(MAT_DATE_FORMATS)_dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef) {
    super(_elementRef, _intl, _ngZone, _dateAdapter, _dateFormats, changeDetectorRef);
  }
}

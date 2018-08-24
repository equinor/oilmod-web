import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, Optional,
  ViewEncapsulation
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatCalendar, MatDateFormats, MatDatepickerIntl } from '@angular/material';
import { Key } from '../shared/abstract-and-interfaces/keyPress.enum';

const yearsPerPage = 24;

/**
 * StoInlineCalendar is based on {@link MatCalendar}.
 * It is designed to be used inline, rather than in a modal.
 * Currently used in {@link StoDaterangeComponent} - example usage can be found there.
 */
@Component({
  selector: 'sto-inline-datepicker',
  template: `
	  <div class="mat-calendar-header">
		  <div class="mat-calendar-controls">
			  <button mat-button class="mat-calendar-period-button" (click)="currentPeriodClicked()"
					  [attr.aria-label]="periodButtonLabel">{{periodButtonLabel}}
				  <div class="mat-calendar-arrow" [class.mat-calendar-invert]="currentView != 'month'"></div>
			  </button>
			  <div class="mat-calendar-spacer"></div>
			  <button mat-icon-button class="mat-calendar-previous-button"
					  (click)="previousClicked()"
					  [attr.aria-label]="prevButtonLabel"></button>
			  <button mat-icon-button class="mat-calendar-next-button"
					  (click)="nextClicked()" [attr.aria-label]="nextButtonLabel"></button>
		  </div>
	  </div>
	  <div class="mat-calendar-content" (keydown)="_handleCalendarBodyKeydown($event)"
		   [ngSwitch]="currentView" cdkMonitorSubtreeFocus tabindex="-1">
		  <sto-month-view *ngSwitchCase="'month'" [activeDate]="activeDate"
						  [endDate]="endDate" [startDate]="startDate"
						  [selected]="selected" [dateFilter]="dateFilter" [maxDate]="maxDate"
						  [minDate]="minDate" (selectedChange)="_dateSelected($event)"
						  (_userSelection)="_userSelected()"></sto-month-view>
		  <mat-year-view *ngSwitchCase="'year'" [activeDate]="activeDate"
						 [selected]="selected" [dateFilter]="dateFilter" [maxDate]="maxDate"
						 [minDate]="minDate" (selectedChange)="_goToDateInView($event, 'month')"></mat-year-view>
		  <mat-multi-year-view *ngSwitchCase="'multi-year'" [activeDate]="activeDate"
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
  /**
   * endDate and startDate is used in {@link StoDatepickerCalendarBodyComponent}
   * They are used to highlight a range of of active dates in {@link StoDaterangeComponent}
   */
  @Input() endDate: Date;
  @Input() startDate: Date;
  private dateAdapterOwn: DateAdapter<Date>;
  private __intl;

  get periodButtonLabel(): string {
    return this.currentView == 'month' ?
      this.__intl.switchToMultiYearViewLabel : this.__intl.switchToMonthViewLabel;
  }

  /** The label for the the previous button. */
  get prevButtonLabel(): string {
    return {
      'month': this.__intl.prevMonthLabel,
      'year': this.__intl.prevYearLabel,
      'multi-year': this.__intl.prevMultiYearLabel
    }[this.currentView];
  }

  /** The label for the the next button. */
  get nextButtonLabel(): string {
    return {
      'month': this.__intl.nextMonthLabel,
      'year': this.__intl.nextYearLabel,
      'multi-year': this.__intl.nextMultiYearLabel
    }[this.currentView];
  }

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.currentView = this.currentView == 'month' ? 'multi-year' : 'month';
  }

  /** Handles user clicks on the previous button. */
  previousClicked(): void {
    this.activeDate = this.currentView == 'month' ?
      this.dateAdapterOwn.addCalendarMonths(this.activeDate, -1) :
      this.dateAdapterOwn.addCalendarYears(
        this.activeDate, this.currentView == 'year' ? -1 : -yearsPerPage
      );
  }

  /** Handles user clicks on the next button. */
  nextClicked(): void {
    this.activeDate = this.currentView == 'month' ?
      this.dateAdapterOwn.addCalendarMonths(this.activeDate, 1) :
      this.dateAdapterOwn.addCalendarYears(
        this.activeDate,
        this.currentView == 'year' ? 1 : yearsPerPage
      );
  }

  /** Whether the previous period button is enabled. */
  previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate ||
      !this._isSameView(this.activeDate, this.minDate);
  }

  /** Whether the next period button is enabled. */
  nextEnabled(): boolean {
    return !this.maxDate ||
      !this._isSameView(this.activeDate, this.maxDate);
  }

  /** Handles keydown events on the calendar body when calendar is in month view. */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void {
    // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
    // disabled ones from being selected. This may not be ideal, we should look into whether
    // navigation should skip over disabled dates, and if so, how to implement that efficiently.
    const oldActiveDate = this.activeDate;
    const isRtl = false;

    switch (event.keyCode) {
      case Key.LeftArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate, isRtl ? 1 : -1);
        break;
      case Key.RightArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate, isRtl ? -1 : 1);
        break;
      case Key.UpArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate, -7);
        break;
      case Key.DownArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate, 7);
        break;
      case Key.Home:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate,
          1 - this.dateAdapterOwn.getDate(this.activeDate));
        break;
      case Key.End:
        this.activeDate = this.dateAdapterOwn.addCalendarDays(this.activeDate,
          (this.dateAdapterOwn.getNumDaysInMonth(this.activeDate) -
            this.dateAdapterOwn.getDate(this.activeDate)));
        break;
      case Key.PageUp:
        this.activeDate = event.altKey ?
          this.dateAdapterOwn.addCalendarYears(this.activeDate, -1) :
          this.dateAdapterOwn.addCalendarMonths(this.activeDate, -1);
        break;
      case Key.PageDown:
        this.activeDate = event.altKey ?
          this.dateAdapterOwn.addCalendarYears(this.activeDate, 1) :
          this.dateAdapterOwn.addCalendarMonths(this.activeDate, 1);
        break;
      case Key.Enter:
        if (!this.dateFilter || this.dateFilter(this.activeDate)) {
          this._dateSelected(this.activeDate);
          this._userSelection.emit();
          // Prevent unexpected default actions such as form submission.
          event.preventDefault();
        }
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: Date, date2: Date): boolean {
    if (this.currentView == 'month') {
      return this.dateAdapterOwn.getYear(date1) == this.dateAdapterOwn.getYear(date2) &&
        this.dateAdapterOwn.getMonth(date1) == this.dateAdapterOwn.getMonth(date2);
    }
    if (this.currentView == 'year') {
      return this.dateAdapterOwn.getYear(date1) == this.dateAdapterOwn.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return Math.floor(this.dateAdapterOwn.getYear(date1) / 30) ==
      Math.floor(this.dateAdapterOwn.getYear(date2) / 30);
  }

  constructor(_intl: MatDatepickerIntl
    , dateAdapter: DateAdapter<Date>
    , @Optional() @Inject(MAT_DATE_FORMATS)_dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef) {
    super(_intl, dateAdapter, _dateFormats, changeDetectorRef);
    this.dateAdapterOwn = dateAdapter;
    this.__intl = _intl;
  }
}

import { ChangeDetectorRef, Component, HostBinding, Inject, Input, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepickerIntl } from '@angular/material/datepicker';
import { Key } from '@ngx-stoui/core';
import { StoDatepickerMonthviewComponent } from './sto-inline-calendar-month-view';

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
        <button mat-button
                [attr.tabIndex]="month ? -1 : 1"
                class="mat-calendar-period-button"
                (click)="month ? $event.preventDefault() : currentPeriodClicked()"
                [attr.aria-label]="periodButtonLabel">{{ month ? year : periodButtonText }}
          <div class="mat-calendar-arrow"
               *ngIf="!month"
               [class.mat-calendar-invert]="currentView != 'month'"></div>
        </button>
        <div class="mat-calendar-spacer"></div>
        <button mat-icon-button
                class="mat-calendar-previous-button"
                (click)="previousClicked()"
                [attr.aria-label]="prevButtonLabel"></button>
        <button mat-icon-button
                class="mat-calendar-next-button"
                (click)="nextClicked()"
                [attr.aria-label]="nextButtonLabel"></button>
      </div>
    </div>
    <!--Month picker-->
    <div class="mat-calendar-content"
         *ngIf="month"
         (keydown)="handleMonthKeyDown($event)"
         [ngSwitch]="currentView"
         cdkMonitorSubtreeFocus
         tabindex="-1">
      <mat-year-view [activeDate]="activeDate"
                     *ngSwitchDefault
                     [selected]="selected"
                     [dateFilter]="dateFilter"
                     [maxDate]="maxDate"
                     [minDate]="minDate"
                     (selectedChange)="onMonthChange($event)"></mat-year-view>
      <mat-multi-year-view *ngSwitchCase="'multi-year'"
                           [activeDate]="activeDate"
                           [selected]="selected"
                           [dateFilter]="dateFilter"
                           [maxDate]="maxDate"
                           [minDate]="minDate"
                           (selectedChange)="_goToDateInView($event, 'year')"></mat-multi-year-view>
    </div>
    <!--Date picker-->
    <div class="mat-calendar-content"
         (keydown)="_handleCalendarBodyKeydown($event)"
         *ngIf="!month"
         [ngSwitch]="currentView"
         cdkMonitorSubtreeFocus
         tabindex="-1">
      <sto-month-view *ngSwitchCase="'month'"
                      [activeDate]="activeDate"
                      [endDate]="endDate"
                      [startDate]="startDate"
                      [selected]="selected"
                      [dateFilter]="dateFilter"
                      [maxDate]="maxDate"
                      [minDate]="minDate"
                      (selectedChange)="_dateSelected($event)"
                      (_userSelection)="_userSelected()"></sto-month-view>
      <mat-year-view *ngSwitchCase="'year'"
                     [activeDate]="activeDate"
                     [selected]="selected"
                     [dateFilter]="dateFilter"
                     [maxDate]="maxDate"
                     [minDate]="minDate"
                     (selectedChange)="_goToDateInView($event, 'month')"></mat-year-view>
      <mat-multi-year-view *ngSwitchCase="'multi-year'"
                           [activeDate]="activeDate"
                           [selected]="selected"
                           [dateFilter]="dateFilter"
                           [maxDate]="maxDate"
                           [minDate]="minDate"
                           (selectedChange)="_goToDateInView($event, 'year')"></mat-multi-year-view>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ `./sto-inline-calendar.scss` ],
})
export class StoInlineCalendarComponent extends MatCalendar<Date> {
  log = console.log;
  @HostBinding('class.mat-calendar')
  @HostBinding('class.sto-calendar__inline')
  classBindings = true;
  /**
   * endDate and startDate is used in {@link StoDatepickerCalendarBodyComponent}
   * They are used to highlight a range of of active dates in {@link StoDaterangeComponent}
   */
  @Input() endDate: Date;
  @Input() startDate: Date;
  @Input()
  month = false;
  @ViewChild(StoDatepickerMonthviewComponent, { static: false }) monthView: StoDatepickerMonthviewComponent;
  private dateAdapterOwn: DateAdapter<Date>;
  private dateFormats: MatDateFormats;
  private __intl;

  get periodButtonLabel(): string {
    return this.currentView === 'month' ?
      this.__intl.switchToMultiYearViewLabel : this.__intl.switchToMonthViewLabel;
  }

  get year() {
    return this.dateAdapterOwn.getYearName(this.activeDate);
  }

  get periodButtonText(): string {
    if ( this.currentView === 'month' ) {
      return this.dateAdapterOwn
        .format(this.activeDate, this.dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
    }
    if ( this.currentView === 'year' ) {
      return this.dateAdapterOwn.getYearName(this.activeDate);
    }
    const activeYear = this.dateAdapterOwn.getYear(this.activeDate);
    const firstYearInView = this.dateAdapterOwn.getYearName(
      this.dateAdapterOwn.createDate(activeYear - activeYear % 24, 0, 1));
    const lastYearInView = this.dateAdapterOwn.getYearName(
      this.dateAdapterOwn.createDate(activeYear + yearsPerPage - 1 - activeYear % 24, 0, 1));
    return `${firstYearInView} \u2013 ${lastYearInView}`;
  }

  /** The label for the the previous button. */
  get prevButtonLabel(): string {
    return {
      'month': this.__intl.prevMonthLabel,
      'year': this.__intl.prevYearLabel,
      'multi-year': this.__intl.prevMultiYearLabel
    }[ this.currentView ];
  }

  /** The label for the the next button. */
  get nextButtonLabel(): string {
    return {
      'month': this.__intl.nextMonthLabel,
      'year': this.__intl.nextYearLabel,
      'multi-year': this.__intl.nextMultiYearLabel
    }[ this.currentView ];
  }
  onMonthChange(date: Date) {
    this.activeDate = date;
    this._dateSelected(date);
  }

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.currentView = this.currentView === 'month' ? 'multi-year' : 'month';
  }

  /** Handles user clicks on the previous button. */
  previousClicked(): void {
    if ( this.month ) {
      this.activeDate = this.dateAdapterOwn.addCalendarYears(
        this.activeDate, -1
      );
    } else {
      this.activeDate = this.currentView === 'month' ?
        this.dateAdapterOwn.addCalendarMonths(this.activeDate, -1) :
        this.dateAdapterOwn.addCalendarYears(
          this.activeDate, this.currentView === 'year' ? -1 : -yearsPerPage
        );
    }
  }

  /** Handles user clicks on the next button. */
  nextClicked(): void {
    if ( this.month ) {
      this.activeDate = this.dateAdapterOwn.addCalendarYears(
        this.activeDate,
        1
      );
    } else {
      this.activeDate = this.currentView === 'month' ?
        this.dateAdapterOwn.addCalendarMonths(this.activeDate, 1) :
        this.dateAdapterOwn.addCalendarYears(
          this.activeDate,
          this.currentView === 'year' ? 1 : yearsPerPage
        );
    }
  }

  /** Whether the previous period button is enabled. */
  previousEnabled(): boolean {
    if ( !this.minDate ) {
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
    const oldActiveDate = this.activeDate;
    const isRtl = false;

    switch ( event.keyCode ) {
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
          ( this.dateAdapterOwn.getNumDaysInMonth(this.activeDate) -
            this.dateAdapterOwn.getDate(this.activeDate) ));
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
        if ( !this.dateFilter || this.dateFilter(this.activeDate) ) {
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

  /** Handles keydown events on the calendar body when calendar is in month view. */
  handleMonthKeyDown(event: KeyboardEvent): void {
    const isRtl = false;

    switch ( event.keyCode ) {
      case Key.LeftArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarMonths(this.activeDate, isRtl ? 1 : -1);
        break;
      case Key.RightArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarMonths(this.activeDate, isRtl ? -1 : 1);
        break;
      case Key.UpArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarMonths(this.activeDate, -4);
        break;
      case Key.DownArrow:
        this.activeDate = this.dateAdapterOwn.addCalendarMonths(this.activeDate, 4);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: Date, date2: Date): boolean {
    if ( this.currentView === 'month' ) {
      return this.dateAdapterOwn.getYear(date1) === this.dateAdapterOwn.getYear(date2) &&
        this.dateAdapterOwn.getMonth(date1) === this.dateAdapterOwn.getMonth(date2);
    }
    if ( this.currentView === 'year' ) {
      return this.dateAdapterOwn.getYear(date1) === this.dateAdapterOwn.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return Math.floor(this.dateAdapterOwn.getYear(date1) / 30) ===
      Math.floor(this.dateAdapterOwn.getYear(date2) / 30);
  }

  constructor(_intl: MatDatepickerIntl
    , dateAdapter: DateAdapter<Date>
    , @Optional() @Inject(MAT_DATE_FORMATS)_dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef) {
    super(_intl, dateAdapter, _dateFormats, changeDetectorRef);
    this.dateAdapterOwn = dateAdapter;
    this.dateFormats = _dateFormats;
    this.__intl = _intl;
  }
}

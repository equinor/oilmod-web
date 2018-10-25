import {ChangeDetectorRef, Component, Inject, Input, Optional, ViewChild, ViewEncapsulation} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MatMonthView } from '@angular/material';
import { Directionality } from '@angular/cdk/bidi';
import {StoDatepickerCalendarBodyComponent} from './sto-inline-calendar-body';

@Component({
  selector: 'sto-month-view',
  template: `
    <table class="mat-calendar-table">
      <thead class="mat-calendar-table-header">
        <tr>
          <th *ngFor="let day of _weekdays" [attr.aria-label]="day.long">{{day.narrow}}</th>
        </tr>
        <tr>
          <th class="mat-calendar-table-header-divider" colspan="7" aria-hidden="true"></th>
        </tr>
      </thead>
      <tbody sto-calendar-body [label]="_monthLabel" [rows]="_weeks"
             [endDate]="endDate" [startDate]="startDate"
             [selectedDate]="selected"
             [todayValue]="_todayDate" [selectedValue]="_selectedDate"
             [labelMinRequiredCells]="3"
             [activeCell]="_dateAdapter.getDate(activeDate) - 1" (selectedValueChange)="_dateSelected($event)"></tbody>
    </table>`,
  encapsulation: ViewEncapsulation.None,
  styles: [``]
})
export class StoDatepickerMonthviewComponent extends MatMonthView<Date> {
  @Input() endDate: Date;
  @Input() startDate: Date;
  @ViewChild(StoDatepickerCalendarBodyComponent) _matCalendarBody: StoDatepickerCalendarBodyComponent;

  constructor(cd: ChangeDetectorRef,
              @Optional() @Inject(MAT_DATE_FORMATS) _dateFormats: MatDateFormats,
              @Optional() _dateAdapter: DateAdapter<Date>,
              @Optional() _dir?: Directionality) {
    super(cd, _dateFormats, _dateAdapter, _dir);
  }
}

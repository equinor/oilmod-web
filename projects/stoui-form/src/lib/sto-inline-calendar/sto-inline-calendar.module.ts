import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { StoInlineCalendarComponent } from './sto-inline-calendar';
import { StoDatepickerMonthviewComponent } from './sto-inline-calendar-month-view';
import { StoDatepickerCalendarBodyComponent } from './sto-inline-calendar-body';

@NgModule({
  imports: [MatDatepickerModule, MatButtonModule, CommonModule],
  exports: [
    StoInlineCalendarComponent,
    StoDatepickerMonthviewComponent,
    StoDatepickerCalendarBodyComponent
  ],
  declarations: [
    StoInlineCalendarComponent,
    StoDatepickerMonthviewComponent,
    StoDatepickerCalendarBodyComponent
  ]
})
export class StoInlineCalendarModule {
}

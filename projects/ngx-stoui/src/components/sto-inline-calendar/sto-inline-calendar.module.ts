import { NgModule } from '@angular/core';
import { MatButtonModule, MatDatepickerModule } from '@angular/material';
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

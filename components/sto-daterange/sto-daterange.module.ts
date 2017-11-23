import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoDaterangeComponent } from './sto-daterange.component';
import {
  DateAdapter,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  NativeDateAdapter
} from '@angular/material';
import { StoInlineCalendarComponent } from './sto-inline-calendar';

export class StoDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule],
  exports: [StoDaterangeComponent],
  declarations: [StoDaterangeComponent, StoInlineCalendarComponent],
  providers: [{provide: DateAdapter, useClass: StoDateAdapter }]
})
export class StoDaterangeModule {
}

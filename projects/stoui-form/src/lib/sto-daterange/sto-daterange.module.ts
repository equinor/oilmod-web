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
import { StoDaterangeInlineWrapper } from './sto-inline-calendar';
import { StoPipesModule } from '@ngx-stoui/core';
import { StoInlineCalendarModule } from '../sto-inline-calendar/sto-inline-calendar.module';

export class StoDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, StoInlineCalendarModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, StoPipesModule,
    MatDatepickerModule, MatNativeDateModule],
  exports: [StoDaterangeComponent],
  declarations: [StoDaterangeComponent, StoDaterangeInlineWrapper],
  providers: [{provide: DateAdapter, useClass: StoDateAdapter }]
})
export class StoDaterangeModule {
}

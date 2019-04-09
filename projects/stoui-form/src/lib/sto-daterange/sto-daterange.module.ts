import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoDaterangeComponent } from './sto-daterange.component';
import {
  DateAdapter,
  MatButtonModule,
  MatChipsModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  NativeDateAdapter
} from '@angular/material';
import { StoDaterangeInlineWrapper } from './sto-inline-calendar';
import { StoPipesModule } from '@ngx-stoui/core';
import { StoInlineCalendarModule } from '../sto-inline-calendar/sto-inline-calendar.module';
import { DaterangeInputComponent } from './daterange-input/daterange-input.component';
import { DaterangePopoutComponent } from './daterange-popout/daterange-popout.component';
import { DateRangeAdapter } from './date-adapter';

export class StoDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, StoInlineCalendarModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, StoPipesModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule ],
  exports: [StoDaterangeComponent],
  declarations: [ StoDaterangeComponent, StoDaterangeInlineWrapper, DaterangeInputComponent, DaterangePopoutComponent ],
  providers: [ { provide: DateAdapter, useClass: DateRangeAdapter } ]
})
export class StoDaterangeModule {
}

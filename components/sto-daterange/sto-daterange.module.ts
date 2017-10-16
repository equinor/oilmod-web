import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoCalendarModule } from '../sto-calendar/sto-calendar.component';
import { StoDaterangeComponent } from './sto-daterange.component';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatButtonModule } from '@angular/material';
import { StoInlineCalendarComponent } from './sto-inline-calendar';

@NgModule({
  imports: [CommonModule, StoCalendarModule, ReactiveFormsModule, StoButtonModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule],
  exports: [StoDaterangeComponent],
  declarations: [StoDaterangeComponent, StoInlineCalendarComponent]
})
export class StoDaterangeModule {
}

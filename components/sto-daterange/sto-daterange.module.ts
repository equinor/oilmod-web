import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoCalendarModule } from '../sto-calendar/sto-calendar.component';
import { StoDaterangeComponent } from './sto-daterange.component';
import { StoButtonModule } from '../sto-button/sto-button.directive';

@NgModule({
  imports: [CommonModule, StoCalendarModule, ReactiveFormsModule, StoButtonModule],
  exports: [StoDaterangeComponent],
  declarations: [StoDaterangeComponent]
})
export class StoDaterangeModule {
}

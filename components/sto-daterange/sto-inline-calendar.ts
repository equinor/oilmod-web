import { Component, forwardRef, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../sto-shared/sto-api';

@Component({
  selector: 'sto-inline-calendar',
  template: `
    <mat-calendar [startAt]="value" [minDate]="minDate" [maxDate]="maxDate"
    [selected]="value" (selectedChange)="changeDate($event)"></mat-calendar>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoInlineCalendarComponent),
      multi: true
    },
    DomHandler
  ]
})
export class StoInlineCalendarComponent implements ControlValueAccessor {
  public value: Date;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  private propagateChange = (_: any) => {
  };

  public changeDate(date) {
    this.value = date;
    this.propagateChange(date);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
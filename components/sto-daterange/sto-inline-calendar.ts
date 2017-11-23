import { Component, forwardRef, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../sto-shared/sto-api';

@Component({
  selector: 'sto-inline-calendar',
  template: `
    <mat-calendar [startAt]="value" [minDate]="minDate" [maxDate]="maxDate"
    *ngIf="hackToShowCorrectMonth"
    [selected]="value" (selectedChange)="changeDate($event)"></mat-calendar>
    <mat-calendar [startAt]="value" [minDate]="minDate" [maxDate]="maxDate"
    *ngIf="!hackToShowCorrectMonth"
    [selected]="value" (selectedChange)="changeDate($event)"></mat-calendar>
    <span style="display: none">{{ hackToShowCorrectMonth }}</span>
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
  public hackToShowCorrectMonth: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  private propagateChange = (_: any) => {
  };

  public changeDate(date) {
    this.value = date;
    // console.log(date);
    this.propagateChange(date);
  }

  writeValue(value: any): void {
    this.value = value ? new Date(value) : null;
    this.hackToShowCorrectMonth = !this.hackToShowCorrectMonth;
/*    setTimeout(() => {
      if (value instanceof Date) {
        this.value = new Date(value);
      }
      this.hackToShowCorrectMonth = !this.hackToShowCorrectMonth;
    });*/
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
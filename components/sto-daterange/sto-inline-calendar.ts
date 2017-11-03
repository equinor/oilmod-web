import { Component, forwardRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from '../sto-shared/sto-api';

@Component({
  selector: 'sto-inline-calendar',
  template: `
    <mat-calendar [startAt]="value" [selected]="value" (selectedChange)="changeDate($event)"></mat-calendar>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoInlineCalendarComponent),
      multi: true
    },
    DomHandler
  ],
  animations: [
    trigger('overlayState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ]
})
export class StoInlineCalendarComponent implements ControlValueAccessor {
  public value: Date;
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
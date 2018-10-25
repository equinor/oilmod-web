import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sto-inline-calendar',
  template: `
	  <sto-inline-datepicker [endDate]="endDate" [startDate]="startDate"
							 [startAt]="value" [minDate]="minDate" [maxDate]="maxDate"
							 *ngIf="hackToShowCorrectMonth"
							 [selected]="value" (selectedChange)="changeDate($event)"></sto-inline-datepicker>
	  <sto-inline-datepicker [endDate]="endDate" [startDate]="startDate"
							 [startAt]="value" [minDate]="minDate" [maxDate]="maxDate"
							 *ngIf="!hackToShowCorrectMonth"
							 [selected]="value" (selectedChange)="changeDate($event)"></sto-inline-datepicker>
	  <span style="display: none">{{ hackToShowCorrectMonth }}</span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoDaterangeInlineWrapper),
      multi: true
    }
  ]
})
export class StoDaterangeInlineWrapper implements ControlValueAccessor {
  public value: Date;
  public hackToShowCorrectMonth: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() startDate: Date;
  @Input() endDate: Date;
  private propagateChange = (_: any) => {
  }

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

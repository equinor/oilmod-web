import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatFormFieldControl } from '@angular/material';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { addYears, format, isSameDay, isValid, parse, subYears } from 'date-fns';

export class DateRange {
  constructor(public start: Date | string, public end?: Date | string) {
  }
}

@Component({
  selector: 'sto-daterange-input',
  templateUrl: './daterange-input.component.html',
  styleUrls: [ './daterange-input.component.scss' ],
  providers: [ { provide: MatFormFieldControl, useExisting: DaterangeInputComponent } ],
})
export class DaterangeInputComponent implements MatFormFieldControl<DateRange>, OnDestroy {

  static nextId = 0;

  @Input()
  showPickersOnFocus: boolean;
  private destroyed$ = new Subject();
  @ViewChild('container')
  container: ElementRef<HTMLDivElement>;
  public startDatePlaceholder$: Observable<Date>;
  public endDatePlaceholder$: Observable<Date>;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  ngControl = null;
  errorState = false;
  controlType = 'date-input';
  id = `date-input-${DaterangeInputComponent.nextId++}`;
  describedBy = '';

  get empty() {
    const { value: { area, exchange, subscriber } } = this.parts;

    return !area && !exchange && !subscriber;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get value(): DateRange | null {
    const { value: { start, end } } = this.parts;
    if ( start ) {
      return new DateRange(start, end);
    }
    return null;
  }

  set value(date: DateRange | null) {
    const { start, end } = date || new DateRange(new Date());
    this.parts.setValue({ start, end }, { emitEvent: false });
    this.startDate = start ? format(start, 'MMM D, YYYY') : '';
    this.endDate = end ? format(end, 'MMM D, YYYY') : '';
    this.stateChanges.next();
  }

  @Output()
  valueChanged = new EventEmitter<DateRange>();
  startDate: string = '';
  endDate: string = '';

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>) {
    this.parts = fb.group({
      start: [ '', { updateOn: 'blur' } ],
      end: [ '', { updateOn: 'blur' } ]
    });
    const startCtrl = this.parts.get('start');
    const endCtrl = this.parts.get('end');
    this.startDatePlaceholder$ = startCtrl
      .valueChanges
      .pipe(
        startWith(startCtrl.value),
        map(value => value || subYears(endCtrl.value || new Date(), 5))
      );
    this.endDatePlaceholder$ = endCtrl
      .valueChanges
      .pipe(
        startWith(endCtrl.value),
        map(value => !!value ? value : addYears(startCtrl.value || new Date(), 5))
      );

    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this.parts.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe((value: DateRange) => {
      if ( value.start ) {
        const parsed = parse(value.start);
        if ( isNaN(parsed.getTime()) ) {
          this.startDate = '';
          value.start = null;
        } else {
          this.startDate = format(value.start, 'MMM D, YYYY');
        }
      }
      if ( value.end ) {
        const parsed = parse(value.end);
        if ( isNaN(parsed.getTime()) ) {
          this.endDate = '';
          value.end = null;
        } else {
          this.endDate = format(value.end, 'MMM D, YYYY');
        }
      }
      this.valueChanged.emit(value);
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public openFrom() {
    const cont = this.container.nativeElement;
    const input = cont.querySelector('input');
    input.click();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ( ( event.target as Element ).tagName.toLowerCase() != 'input' ) {
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
  }

  clear(control: AbstractControl) {
    control.setValue(null);
  }

  onValueChange(key: string, value: Date | string, inp?: HTMLInputElement) {
    if ( !( value instanceof Date ) ) {
      value = parse(value);
    }
    let valid = true;
    try {
      isValid(value);
    } catch {
      valid = false;
    }
    if ( !valid || isNaN(value.getTime()) ) {
      this.parts.get(key).setValue(null);
      if ( inp ) {
        inp.value = '';
      }
      return;
    }
    const isSame = isSameDay(this.parts.get(key).value, value);
    if ( !isSame ) {
      this.parts.get(key).setValue(value);
    }
  }

  focusEnd(el: HTMLInputElement) {
    setTimeout(() => {
      el.focus();
      el.click();
    });
  }
}

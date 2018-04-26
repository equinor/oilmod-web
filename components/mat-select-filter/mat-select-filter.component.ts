import { Component, OnInit, forwardRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sto-mat-select-filter',
  templateUrl: './mat-select-filter.component.html',
  styleUrls: ['./mat-select-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectFilterComponent),
      multi: true
    }
  ]
})
export class MatSelectFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public checkboxControl = new FormControl();
  public inputControl = new FormControl();
  @Input() isMulti: boolean;
  @Output() selectAll = new EventEmitter<boolean>();
  @Input() indeterminate: boolean;
  private destroyed$ = new Subject();

  writeValue(value: any) {
    if (value) {
      this.inputControl.setValue(value);
    }
  }

  propagateChange = (_: any) => {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }


  constructor() { }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.checkboxControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(value => this.selectAll.emit(value));

    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(value => this.propagateChange(value));
  }

}

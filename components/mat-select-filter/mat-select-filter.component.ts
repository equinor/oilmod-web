import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

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
export class MatSelectFilterComponent implements OnInit, ControlValueAccessor {
  public checkboxControl = new FormControl();
  public inputControl = new FormControl();
  @Input() isMulti: boolean;
  @Output() selectAll = new EventEmitter<boolean>();
  @Input() indeterminate: boolean;

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

  ngOnInit() {
    this.checkboxControl.valueChanges
      .subscribe(value => this.selectAll.emit(value));

    this.inputControl.valueChanges
      .subscribe(value => this.propagateChange(value));
  }

}

import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sto-select-filter',
  templateUrl: './sto-select-filter.component.html',
  styleUrls: ['./sto-select-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoSelectFilterComponent),
      multi: true
    }
  ]
})
export class StoSelectFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class.sto-select-filter') cssClass: boolean = true;

  public checkboxControl = new FormControl();
  public inputControl = new FormControl();

  private _value: any;
  @Input() set value(value : any){
    this._value = value;
    this.writeValue(value)
  }
  get value(): any{
    return this._value;
  };

  private _isChecked : boolean;
  @Input() set isChecked(isChecked : boolean){
    this._isChecked = isChecked;
    this.checkboxControl.setValue(isChecked, {emitEvent : false});
  }

  get isChecked(): boolean{
    return this._isChecked;
  };

  @Output() selectAll = new EventEmitter<boolean>();
  @Output() valueChanges = new EventEmitter<boolean>();

  @Input() isMulti: boolean;
  @Input() isFilter: boolean;
  private destroyed$ = new Subject();

  writeValue(value: any) {
    if (value || value === '') {
      this.inputControl.setValue(value);
    }
  }

  propagateChange = (value: any) => {
    this.valueChanges.emit(value);
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
      ).subscribe(isChecked => {
        this.isChecked = isChecked;
        this.selectAll.emit(isChecked)
      });

    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(value => this.propagateChange(value));
  }

}

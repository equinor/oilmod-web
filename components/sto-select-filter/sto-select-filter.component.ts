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

  public indeterminate : boolean;

  private _value: any;
  @Input() set value(value : any){
    this._value = value;
    this.writeValue(value)
  }
  get value(): any{
    return this._value;
  };


  private _total : number;
  @Input() set total(total : number){
    this._total = total;
  }
  get total(): number{
    return this._total;
  };


  private _selected : number;
  @Input() set selected(selected : number){
    if(this.total === selected){
      this.isChecked(true);
      this.indeterminate = false;
    } else if(selected > 0){
      this.indeterminate = true;
      this.isChecked(false);
    }
    else{
      this.indeterminate = false;
      this.isChecked(false);
    }
    this._selected = selected;
  }
  get selected(): number{
    return this._selected;
  };


  public isChecked(isChecked : boolean){;
    this.checkboxControl.setValue(isChecked, {emitEvent : false});
  }



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
        this.selectAll.emit(isChecked)
      });

    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(value => this.propagateChange(value));
  }

}

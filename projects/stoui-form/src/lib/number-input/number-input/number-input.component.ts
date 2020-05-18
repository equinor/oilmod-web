import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NumberInputPipe } from '../number-input.pipe';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { startWith } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormFieldBase } from '../../sto-form/form-field.base';

/*
class NumberInputBase {
  constructor(public _elementRef: ElementRef,
              public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {}
}
const _NumberInputBase: CanUpdateErrorStateCtor = mixinErrorState(NumberInputBase.constructor);
*/


@Component({
  selector: 'sto-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: [ './number-input.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberInputComponent }
  ]
})
export class NumberInputComponent extends FormFieldBase implements DoCheck, OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<number> {
  static nextId = 0;
  stateChanges = new Subject<void>();
  private numberFormatter = new NumberInputPipe();
  focused: boolean;
  autofilled: boolean;
  controlType = 'number-input';
  ctrl = new FormControl();
  public sub = new Subscription();

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @HostBinding()
  id = `value-unit-input-${NumberInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby')
  describedBy = '';

  errorState: boolean;

  /*  get errorState() {
      return this._errorState && (this.ngControl ? this.ngControl.touched : false);
    }

    set errorState(errorState) {
      this._errorState = errorState;
      this.stateChanges.next();
    }

    private _errorState: boolean;*/

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    this._disabled ? this.ctrl.disable(opts) : this.ctrl.enable(opts);
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _readonly = false;

  @Input()
  get fractionSize() {
    return this._fractionSize;
  }

  set fractionSize(fractionSize) {
    if ( !fractionSize && fractionSize !== 0 ) {
      fractionSize = 3;
    }
    this._fractionSize = fractionSize;
    this.value = this._value;
    this.stateChanges.next();
  }

  private _fractionSize: number;

  get empty() {
    const value = this.ctrl.value;
    return !( value && value !== 0 );
  }

  @Input()
  get placeholder() {
    return this._placeholder || '';
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder: string;

  @Input()
  get tabIndex() {
    return this._tabIndex;
  }

  set tabIndex(tabIndex) {
    this._tabIndex = tabIndex;
    this.stateChanges.next();
  }

  private _tabIndex: number;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    const valueAsString = this.numberFormatter.transform(value, this.fractionSize);
    this.ctrl.setValue(valueAsString, { emitEvent: false });
    this.stateChanges.next();
  }

  private _value: number | null;

  constructor(@Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              @Optional() _parentForm: NgForm,
              @Optional() _parentFormGroup: FormGroupDirective,
              _defaultErrorStateMatcher: ErrorStateMatcher,
              private elRef: ElementRef<HTMLElement>) {
    super(elRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if ( this.ngControl != null ) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngDoCheck(): void {
    if ( this.ngControl ) {
      this.updateErrorState();
    }
  }

  ngOnInit(): void {
    const sub = this.ctrl.valueChanges
      .subscribe((value: string) => {
        let numericValue = parseFloat(this.numberFormatter.parse(value, this.fractionSize));
        numericValue = isNaN(numericValue) ? null : numericValue;
        this.onChange(numericValue);
      });
    this.sub.add(sub);
    if ( this.ngControl ) {
      this.sub.add(this.ngControl.statusChanges
        .pipe(startWith(this.ngControl.status))
        .subscribe(status => {
          this.updateErrorState();
        }));
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }

  onContainerClick(event: MouseEvent): void {
    this.elRef.nativeElement.querySelector('input').focus();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  matOnTouched() {
    this.stateChanges.next();
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}

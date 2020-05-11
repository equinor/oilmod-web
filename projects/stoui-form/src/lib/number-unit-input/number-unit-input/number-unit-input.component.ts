import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class NumberUnit {
  value: number;
  unit: string;
}

@Component({
  selector: 'sto-number-unit-input',
  templateUrl: './number-unit-input.component.html',
  styleUrls: [ './number-unit-input.component.scss' ],
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberUnitInputComponent }
  ],
  encapsulation: ViewEncapsulation.None
})
export class NumberUnitInputComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<NumberUnit> {
  static nextId = 0;
  stateChanges = new Subject<any>();
  public form: FormGroup;
  readonly autofilled: boolean;
  controlType = 'number-unit-input';

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.form.disable() : this.form.enable();
    this.stateChanges.next();
  }

  private _disabled = false;

  get empty() {
    const n = this.form.value;
    return !n.value && !n.unit;
  }

  readonly errorState: boolean;
  public focused: boolean;


  @HostBinding()
  id = `value-unit-input-${NumberUnitInputComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder = 'Quantity';

  @Input()
  get unitPlaceholder() {
    return this._unitPlaceholder;
  }

  set unitPlaceholder(plh) {
    this._unitPlaceholder = plh;
    this.stateChanges.next();
  }

  private _unitPlaceholder = 'Unit';

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get value(): NumberUnit | null {
    return this._value;
  }

  set value(value: NumberUnit | null) {
    this._value = value;
    this.stateChanges.next();
  }

  private _value: NumberUnit | null;

  @HostBinding('attr.aria-describedby') describedBy = '';


  constructor(private fb: FormBuilder,
              @Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private elRef: ElementRef<HTMLElement>) {
    if ( this.ngControl != null ) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      console.log(this.focused);
      this.stateChanges.next();
    });

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: [],
      unit: []
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };


  onContainerClick(event: MouseEvent) {
    if ( ( event.target as Element ).tagName.toLowerCase() != 'input' ) {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }


  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }


  writeValue(value: NumberUnit | null): void {
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

  _handleInput(): void {
    this.onChange(this.value);
  }

}

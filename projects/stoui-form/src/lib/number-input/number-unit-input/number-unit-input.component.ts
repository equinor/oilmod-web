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
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NumberInputPipe } from '../number-input.pipe';
import { MatSelect } from '@angular/material/select';
import { FormFieldBase } from '../../sto-form/form-field.base';
import { ErrorStateMatcher } from '@angular/material/core';

class NumberUnit {
  value: number | string;
  unit: string;
}

@Component({
  selector: 'sto-number-unit-input',
  templateUrl: './number-unit-input.component.html',
  styleUrls: [ './number-unit-input.component.scss' ],
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberUnitInputComponent }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberUnitInputComponent extends FormFieldBase
  implements DoCheck, OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<NumberUnit> {
  static nextId = 0;
  stateChanges = new Subject<any>();
  public form: FormGroup;
  readonly autofilled: boolean;
  controlType = 'number-unit-input';
  private numberFormatterPipe = new NumberInputPipe();
  @ViewChild(MatSelect)
  select: MatSelect;
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>;

  errorState: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    value ? this.form.get('unit').disable(opts) : this.form.get('unit').enable(opts);
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    value ? this.form.get('unit').disable(opts) : this.form.get('unit').enable(opts);
    this.stateChanges.next();
  }

  private _readonly = false;

  @Input()
  get list(): any[] {
    return this._list;
  }

  set list(value: any[]) {
    this._list = value;
    this.stateChanges.next();
  }

  private _list = [];

  @Input()
  get fractionSize() {
    return this._fractionSize || 3;
  }

  set fractionSize(fractionSize) {
    this._fractionSize = fractionSize;
    this.stateChanges.next();
  }

  private _fractionSize: number;

  get empty() {
    const n = this.form.value;
    return !n.value && !n.unit;
  }

  public focused: boolean;


  @HostBinding()
  id = `value-unit-input-${NumberUnitInputComponent.nextId++}`;

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
  get unitPlaceholder() {
    return this._unitPlaceholder || '';
  }

  set unitPlaceholder(plh) {
    this._unitPlaceholder = plh;
    this.stateChanges.next();
  }

  private _unitPlaceholder: string;

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
    if ( value ) {
      const parsedValue = this.numberFormatterPipe.transform(value.value, this.fractionSize);
      this._value = { ...value, value: parsedValue };
    } else {
      this._value = value;
    }
    this.form.patchValue(this._value || {}, { emitEvent: false });
    this.stateChanges.next();
  }

  private _value: NumberUnit | null;

  @HostBinding('attr.aria-describedby') describedBy = '';

  public sub = new Subscription();


  constructor(@Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private fb: FormBuilder,
              @Optional() _parentForm: NgForm,
              @Optional() _parentFormGroup: FormGroupDirective,
              _defaultErrorStateMatcher: ErrorStateMatcher,
              private elRef: ElementRef<HTMLElement>) {
    super(elRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    this.form = this.fb.group({
      value: [],
      unit: []
    });
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
    const sub = this.form.valueChanges
      .subscribe((value: NumberUnit) => {
        const valueAsString = value.value as string;
        let numberValue = parseFloat(this.numberFormatterPipe.parse(valueAsString, this.fractionSize));
        numberValue = !isNaN(numberValue) ? numberValue : null;
        this.onChange({ ...value, value: numberValue });
      });

    this.sub.add(sub);
    if ( this.ngControl ) {
      this.sub.add(this.ngControl.statusChanges
        .subscribe(state => this.updateErrorState())
      );
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }


  onContainerClick(event: MouseEvent) {
    const rect = this.input.nativeElement.getBoundingClientRect();
    const isInputFocus = rect.right >= event.clientX;
    if ( isInputFocus ) {
      this.elRef.nativeElement.querySelector('input').focus();
    } else {
      this.select.focus();
      this.select.open();
    }
  }


  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }


  onChange = (_: any) => {
  };
  onTouched = () => {
  };

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

}

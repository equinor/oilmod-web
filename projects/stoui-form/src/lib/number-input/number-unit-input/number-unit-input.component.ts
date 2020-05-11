import {
  ChangeDetectionStrategy,
  Component,
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
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NumberInputPipe } from '../number-input.pipe';
import { MatSelect } from '@angular/material/select';

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
export class NumberUnitInputComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<NumberUnit> {
  static nextId = 0;
  stateChanges = new Subject<any>();
  public form: FormGroup;
  readonly autofilled: boolean;
  controlType = 'number-unit-input';
  private numberFormatterPipe = new NumberInputPipe();
  @ViewChild(MatSelect)
  select: MatSelect;

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

  readonly errorState: boolean;
  public focused: boolean;


  @HostBinding()
  id = `value-unit-input-${NumberUnitInputComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh || 'Quantity';
    this.stateChanges.next();
  }

  private _placeholder = 'Quantity';

  @Input()
  get unitPlaceholder() {
    return this._unitPlaceholder;
  }

  set unitPlaceholder(plh) {
    this._unitPlaceholder = plh || 'Unit';
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
    if ( value ) {
      const parsedValue = this.numberFormatterPipe.transform(value.value, this.fractionSize);
      this._value = { ...value, value: parsedValue };
    } else {
      this._value = value;
    }
    this.form.patchValue(this._value || {});
    this.stateChanges.next();
  }

  private _value: NumberUnit | null;

  @HostBinding('attr.aria-describedby') describedBy = '';

  private sub: Subscription;


  constructor(private fb: FormBuilder,
              @Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private elRef: ElementRef<HTMLElement>) {
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

  ngOnInit(): void {
    this.sub = this.form.valueChanges
      .subscribe((value: NumberUnit) => {
        const valueAsString = value.value as string;
        let numberValue = parseFloat(this.numberFormatterPipe.parse(valueAsString, this.fractionSize));
        numberValue = !isNaN(numberValue) ? numberValue : null;
        this.onChange({ ...value, value: numberValue });
      });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }


  onContainerClick(event: MouseEvent) {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    const offset = rect.right - 55 - 16;
    const isInputFocus = event.offsetX < offset;
    if ( isInputFocus ) {
      this.elRef.nativeElement.querySelector('input').focus();
    } else {
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

  _handleInput(): void {
    this.onChange(this.value);
  }

}

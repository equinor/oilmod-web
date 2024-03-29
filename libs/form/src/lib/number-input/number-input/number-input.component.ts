import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NumberInputPipe } from '../number-input.pipe';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { startWith } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormFieldBase } from '../../sto-form/form-field.base';
import { NumberInputDirective } from '../number-input.directive';


@Component({
  selector: 'sto-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: [ './number-input.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberInputComponent }
  ],
  standalone: true,
  imports: [
    NumberInputDirective,
    ReactiveFormsModule
  ]
})
export class NumberInputComponent extends FormFieldBase implements DoCheck, OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<number> {
  static nextId = 0;
  stateChanges = new Subject<void>();
  focused: boolean;
  autofilled: boolean;
  controlType = 'number-input';
  ctrl = new FormControl<string | number | null>(null);
  public sub = new Subscription();
  @Input()
  dynamicFractionSize: boolean;
  @HostBinding()
  id = `sto-number-input-${NumberInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby')
  describedBy = '';
  errorState: boolean;
  @Output()
  ngModelChange = new EventEmitter<number | null>();
  private numberFormatter = new NumberInputPipe();

  /*  get errorState() {
      return this._errorState && (this.ngControl ? this.ngControl.touched : false);
    }

    set errorState(errorState) {
      this._errorState = errorState;
      this.stateChanges.next();
    }

    private _errorState: boolean;*/

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

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _disabled = false;

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

  private _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _fractionSize: number;

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

  get empty() {
    const value = this.ctrl.value;
    return !( value && value !== 0 );
  }

  private _placeholder: string;

  @Input()
  get placeholder() {
    return this._placeholder || '';
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _tabIndex: number;

  @Input()
  get tabIndex() {
    return this._tabIndex;
  }

  set tabIndex(tabIndex) {
    this._tabIndex = tabIndex;
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _value: number | null;

  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    const valueAsString = this.numberFormatter.transform(value, this.fractionSize, this.dynamicFractionSize);
    this.ctrl.setValue(valueAsString, { emitEvent: false });
    this.stateChanges.next();
  }

  ngDoCheck(): void {
    if ( this.ngControl ) {
      this.updateErrorState();
    }
  }

  ngOnInit(): void {
    const sub = this.ctrl.valueChanges
      .subscribe((value) => {
        let numericValue: null | number = parseFloat(this.numberFormatter.parse(value as string, this.fractionSize, this.dynamicFractionSize));
        numericValue = isNaN(numericValue) ? null : numericValue;
        this.onChange(numericValue);
        this.ngModelChange.emit(numericValue);
      });

    this.sub.add(sub);
    if ( this.ngControl && this.ngControl.statusChanges ) {
      this.sub.add(this.ngControl.statusChanges
        .pipe(startWith(this.ngControl.status))
        .subscribe(() => {
          this.updateErrorState();
        }));
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContainerClick(event: MouseEvent): void {
    this.elRef.nativeElement.querySelector('input')?.focus();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // eslint-disable-next-line
  onChange = (_: any) => {
  };
  // eslint-disable-next-line
  onTouched = () => {
  };

  matOnTouched() {
    this.stateChanges.next();
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: never): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}

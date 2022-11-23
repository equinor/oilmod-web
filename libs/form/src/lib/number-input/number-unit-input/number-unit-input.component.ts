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
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgControl,
  NgForm,
  ReactiveFormsModule
} from '@angular/forms';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NumberInputPipe } from '../number-input.pipe';
import { MatLegacySelect as MatSelect, MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormFieldBase } from '../../sto-form/form-field.base';
import { ErrorStateMatcher } from '@angular/material/core';
import { debounceTime } from 'rxjs/operators';
import { NumberInputDirective } from '../number-input.directive';
import { NgForOf, NgIf } from '@angular/common';

class NumberUnit {
  value: number | string | null;
  unit: string | null;
}

type NumberUnitForm = {
  value: FormControl<number | string | null>,
  unit: FormControl<string | null>
};

@Component({
  selector: 'sto-number-unit-input',
  templateUrl: './number-unit-input.component.html',
  styleUrls: [ './number-unit-input.component.scss' ],
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberUnitInputComponent }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NumberInputDirective,
    ReactiveFormsModule,
    MatSelectModule,
    NgIf,
    NgForOf
  ]
})
export class NumberUnitInputComponent extends FormFieldBase
  implements DoCheck, OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<NumberUnit> {
  static nextId = 0;
  stateChanges = new Subject<void>();
  public form: FormGroup<NumberUnitForm>;
  readonly autofilled: boolean;
  controlType = 'number-unit-input';
  @ViewChild(MatSelect)
  select: MatSelect;
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>;
  @ViewChild(NumberInputDirective)
  numberInputDirective: NumberInputDirective;
  errorState: boolean;
  @Input()
  unitOptional = true;
  @Input()
  unitClearText = '(none)';
  public focused: boolean;
  @HostBinding()
  id = `value-unit-input-${NumberUnitInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  public sub = new Subscription();
  private numberFormatterPipe = new NumberInputPipe();

  constructor(@Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private fb: FormBuilder,
              @Optional() _parentForm: NgForm,
              @Optional() _parentFormGroup: FormGroupDirective,
              _defaultErrorStateMatcher: ErrorStateMatcher,
              private elRef: ElementRef<HTMLElement>) {
    super(elRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    this.form = this.fb.group<NumberUnitForm>({
      value: this.fb.control(null),
      unit: this.fb.control(null)
    });
    if ( this.ngControl != null ) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(disable: boolean) {
    this._disabled = coerceBooleanProperty(disable);
    const opts = { onlySelf: true, emitEvent: false };
    disable ? this.form.disable(opts) : this.form.enable(opts);
    // disable ? this.form.get('unit').disable(opts) : this.form.get('unit').enable(opts);
    // disable ? this.form.get('value').disable(opts) : this.form.get('value').enable(opts);
    this.stateChanges.next();
  }

  private _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    value ? this.form.get('unit')?.disable(opts) : this.form.get('unit')?.enable(opts);
    this.stateChanges.next();
  }

  private _list: { value: unknown; title?: string; }[] = [];

  @Input()
  get list() {
    return this._list;
  }

  set list(value) {
    this._list = value;
    this.stateChanges.next();
  }

  private _fractionSize: number;

  @Input()
  get fractionSize() {
    return this._fractionSize || 3;
  }

  set fractionSize(fractionSize) {
    this._fractionSize = fractionSize;
    this.stateChanges.next();
  }

  get empty() {
    const n = this.form.value;
    return !n.value && !n.unit;
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

  private _unitPlaceholder: string;

  @Input()
  get unitPlaceholder() {
    return this._unitPlaceholder || '';
  }

  set unitPlaceholder(plh) {
    this._unitPlaceholder = plh;
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

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _value: NumberUnit | null;

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

  ngDoCheck(): void {
    if ( this.ngControl ) {
      this.updateErrorState();
    }
  }

  ngOnInit(): void {
    const sub = this.form.valueChanges
      .subscribe((value) => {
        const valueAsString = value.value as string;
        let numberValue: number | null = parseFloat(this.numberFormatterPipe.parse(valueAsString, this.fractionSize));
        numberValue = !isNaN(numberValue) ? numberValue : null;
        this.onChange({ ...value, value: numberValue });
      });

    this.sub.add(this.stateChanges.pipe(debounceTime(50)).subscribe(() => {
      this.numberInputDirective?.setDisplayValue(this.readonly);
    }));
    this.sub.add(sub);
    if ( this.ngControl && this.ngControl.statusChanges ) {
      this.sub.add(this.ngControl.statusChanges
        .subscribe(() => this.updateErrorState())
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
      this.elRef.nativeElement.querySelector('input')?.focus();
    } else {
      this.select.focus();
      this.select.open();
    }
  }


  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }


  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  onChange = (_: unknown) => {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {
  };

  writeValue(value: NumberUnit | null): void {
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

// {eslint-plugin,eslint-plugin-template,template-parser}@^14.0.0

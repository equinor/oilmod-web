import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FormFieldBase } from '../../sto-form/form-field.base';
import { NumberInputDirective } from '../number-input.directive';

@Component({
  selector: 'sto-number-input',
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy()',
    '[class.floating]': 'shouldLabelFloat',
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberInputComponent },
  ],
  imports: [NumberInputDirective, ReactiveFormsModule],
})
export class NumberInputComponent
  extends FormFieldBase
  implements ControlValueAccessor, MatFormFieldControl<number>
{
  static nextId = 0;
  readonly stateChanges = new Subject<void>();
  readonly ctrl = new FormControl<string | number | null>(null);

  // Private signals
  private readonly _focused = signal(false);
  private readonly _autofilled = signal(false);

  // Signal inputs with transforms - must be public for template binding
  readonly _disabled = input(false, {
    transform: booleanAttribute,
    alias: 'disabled',
  });
  readonly _readonly = input(false, {
    transform: booleanAttribute,
    alias: 'readonly',
  });
  readonly _required = input(false, {
    transform: booleanAttribute,
    alias: 'required',
  });
  readonly fractionSize = input(3, { transform: numberAttribute });
  readonly dynamicFractionSize = input(false, { transform: booleanAttribute });
  readonly _placeholder = input('', { alias: 'placeholder' });
  readonly _tabIndex = input(0, { alias: 'tabIndex' });
  readonly valueModel = model<number | null>(null, { alias: 'value' });

  // MatFormFieldControl interface implementation (primitive getters)
  get focused(): boolean {
    return this._focused();
  }

  get autofilled(): boolean | undefined {
    return this._autofilled();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get readonly(): boolean {
    return this._readonly();
  }

  get required(): boolean {
    return this._required();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get tabIndex(): number {
    return this._tabIndex();
  }

  private readonly _empty = computed(() => {
    const value = this.ctrl.value;
    return !(value && value !== 0);
  });

  get empty(): boolean {
    return this._empty();
  }

  readonly controlType = 'number-input';

  id = `sto-number-input-${NumberInputComponent.nextId++}`;
  readonly describedBy = signal('');

  readonly ngModelChange = output<number | null>();

  private readonly _shouldLabelFloat = computed(
    () => this._focused() || !this.empty,
  );

  get shouldLabelFloat(): boolean {
    return this._shouldLabelFloat();
  }

  constructor() {
    super();

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    // Handle control value changes
    this.ctrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      // The directive already handles parsing, we just need to convert the comma-formatted string to a number
      const stringValue = String(value || '')
        .replace(/\s/g, '')
        .replace(',', '.');
      let numericValue: null | number = parseFloat(stringValue);
      numericValue = isNaN(numericValue) ? null : numericValue;
      this.valueModel.set(numericValue);
      this.onChange(numericValue);
      this.ngModelChange.emit(numericValue);
    });

    // Monitor ngControl status changes
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(startWith(this.ngControl.status), takeUntilDestroyed())
        .subscribe(() => {
          this.updateErrorState();
        });
    }

    // React to disabled input changes
    effect(() => {
      this.setDisabledState(this._disabled());
    });

    // Trigger state changes when inputs change
    effect(() => {
      this._readonly();
      this.fractionSize();
      this._placeholder();
      this._tabIndex();
      this._required();
      this.stateChanges.next();
    });
  }

  // Public accessor for value (ControlValueAccessor interface)
  get value(): number | null {
    return this.valueModel();
  }

  set value(val: number | null) {
    this.valueModel.set(val);
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  // Focus/blur handlers
  onFocus(): void {
    this._focused.set(true);
    this.stateChanges.next();
  }

  onBlur(): void {
    this._focused.set(false);
    this.stateChanges.next();
  }

  // MatFormFieldControl methods
  onContainerClick(_event: MouseEvent): void {
    this.elRef.nativeElement.querySelector('input')?.focus();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy.set(ids.join(' '));
  }

  matOnTouched(): void {
    this.onTouched();
    this.stateChanges.next();
  }

  // ControlValueAccessor implementation
  onChange = (_: number | null) => {};
  onTouched = () => {};

  writeValue(value: number | null): void {
    this.valueModel.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by the disabled input signal and effect
    const opts = { onlySelf: true, emitEvent: false };
    if (isDisabled) {
      this.ctrl.disable(opts);
    } else {
      this.ctrl.enable(opts);
    }
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DoCheck,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
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
  TouchedChangeEvent,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
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
  implements
    ControlValueAccessor,
    MatFormFieldControl<number>,
    AfterViewInit,
    DoCheck
{
  static nextId = 0;
  readonly stateChanges = new Subject<void>();
  readonly ctrl = new FormControl<string | number | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  // Private signals
  private readonly _focused = signal(false);
  private readonly _autofilled = signal(false);

  // Signal inputs with transforms - must be public for template binding
  // These aliases are required for MatFormFieldControl interface compatibility
  /* eslint-disable @angular-eslint/no-input-rename */
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
  /* eslint-enable @angular-eslint/no-input-rename */
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
    // Use valueModel for reactivity instead of ctrl.value
    const value = this.valueModel();
    return value == null || (typeof value === 'number' && isNaN(value));
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

    // React to disabled input changes
    effect(() => {
      this.setDisabledState(this._disabled());
    });

    // Sync valueModel changes to internal ctrl (for [value] binding)
    // Also triggers stateChanges for all reactive inputs
    effect(
      () => {
        const externalValue = this.valueModel();
        // Only sync external value to ctrl when not focused.
        // When focused, the ctrl already has the correct display value from user input;
        // calling setValue would reset the cursor position to the end.
        if (!this._focused()) {
          this.ctrl.setValue(externalValue, { emitEvent: false });
        }

        // Track all reactive inputs that should trigger stateChanges
        this._readonly();
        this.fractionSize();
        this._placeholder();
        this._tabIndex();
        this._required();

        this.stateChanges.next();
      },
      { allowSignalWrites: true },
    );
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

  ngDoCheck(): void {
    // Re-evaluate error state on every change detection cycle to handle cases
    // not covered by subscriptions (e.g. formGroup rebinding, parent form changes).
    // This mirrors Angular Material's MatInput pattern.
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngAfterViewInit(): void {
    // Must be done in ngAfterViewInit because ngControl.control is null in constructor
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(
          startWith(this.ngControl.status),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.updateErrorState();
        });
    }

    // Monitor ngControl touch state changes (for programmatic markAllAsTouched)
    // Must be done in ngAfterViewInit because ngControl.control is null in constructor
    if (this.ngControl?.control?.events) {
      const subscription = this.ngControl.control.events
        .pipe(
          filter(
            (event): event is TouchedChangeEvent =>
              event instanceof TouchedChangeEvent,
          ),
        )
        .subscribe(() => {
          this.updateErrorState();
        });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (_: number | null) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

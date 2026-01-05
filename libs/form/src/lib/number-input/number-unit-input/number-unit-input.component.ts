import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { FormFieldBase } from '../../sto-form/form-field.base';
import { NumberInputDirective } from '../number-input.directive';

interface NumberUnit {
  value: number | string | null;
  unit: string | null;
}

interface NumberUnitForm {
  value: FormControl<number | string | null>;
  unit: FormControl<string | null>;
}

@Component({
  selector: 'sto-number-unit-input',
  templateUrl: './number-unit-input.component.html',
  styleUrl: './number-unit-input.component.scss',
  providers: [
    { provide: MatFormFieldControl, useExisting: NumberUnitInputComponent },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NumberInputDirective, ReactiveFormsModule, MatSelectModule],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy()',
    '[class.floating]': '_shouldLabelFloat()',
  },
})
export class NumberUnitInputComponent
  extends FormFieldBase
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<NumberUnit>
{
  // Injected dependencies
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  ngControl: NgControl;

  // Signals for inputs
  readonly unitOptional = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly unitClearText = input<string>('(none)');
  readonly list = input<{ value: unknown; title?: string }[]>([]);
  readonly fractionSize = input<number>(3);
  readonly unitPlaceholder = input<string>('');
  @Input() placeholder = '';

  // State signals
  private readonly _disabled = signal(false);
  private readonly _readonly = signal(false);
  private readonly _required = signal(false);
  private readonly _rawValue = signal<NumberUnit | null>(null);

  // View children (signal queries)
  readonly select = viewChild(MatSelect);
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly numberInputDirective = viewChild.required(NumberInputDirective);

  // Form field interface
  static nextId = 0;
  readonly id = `value-unit-input-${NumberUnitInputComponent.nextId++}`;
  readonly stateChanges = new Subject<void>();
  readonly controlType = 'number-unit-input';
  readonly autofilled = false;
  readonly describedBy = signal('');
  errorState = false;

  // Form group
  readonly form: FormGroup<NumberUnitForm> = this.fb.group<NumberUnitForm>({
    value: this.fb.control(null),
    unit: this.fb.control(null),
  });

  // Focus state
  private readonly _focused = signal(false);

  // Computed derived state
  private readonly _empty = computed(() => {
    const value = this._rawValue();
    return !value?.value && !value?.unit;
  });

  protected readonly _shouldLabelFloat = computed(
    () => this.focused || !this._empty(),
  );

  // Interface compatibility getters
  get focused(): boolean {
    return this._focused();
  }

  get empty(): boolean {
    return this._empty();
  }

  get shouldLabelFloat(): boolean {
    return this._shouldLabelFloat();
  }

  // Getters/setters for compatibility
  get disabled(): boolean {
    return this._disabled();
  }
  set disabled(value: boolean) {
    this._disabled.set(value);
    const opts = { onlySelf: true, emitEvent: false };
    if (value) {
      this.form.disable(opts);
    } else {
      this.form.enable(opts);
    }
    this.stateChanges.next();
  }

  get readonly(): boolean {
    return this._readonly();
  }
  set readonly(value: boolean) {
    this._readonly.set(value);
    const opts = { onlySelf: true, emitEvent: false };
    if (value) {
      this.form.get('unit')?.disable(opts);
    } else {
      this.form.get('unit')?.enable(opts);
    }
    this.stateChanges.next();
  }

  get required(): boolean {
    return this._required();
  }
  set required(value: boolean) {
    this._required.set(value);
    this.stateChanges.next();
  }

  get value(): NumberUnit | null {
    return this._rawValue();
  }
  set value(value: NumberUnit | null) {
    this._rawValue.set(value);
    this.form.patchValue(value || {}, { emitEvent: false });
    // Manually trigger formatting on the input directive
    this.numberInputDirective()?.onBlur();
    this.stateChanges.next();
  }

  constructor() {
    super();

    // Set up CVA
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    // Form value changes
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const numberValue = this.parseNumberValue(value.value as string);
      this.onChange({ ...value, value: numberValue });
    });

    // Update display value when readonly changes
    effect(() => {
      const readonly = this._readonly();
      const directive = this.numberInputDirective();
      if (directive) {
        directive.setDisplayValue(readonly);
        // After toggling readonly, reformat the value
        if (!readonly) {
          directive.onBlur();
        }
      }
    });
  }

  ngOnInit(): void {
    // Update error state on status changes
    if (this.ngControl) {
      this.updateErrorState();
    }
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateErrorState());
    }
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

  onContainerClick(event: MouseEvent): void {
    const input = this.input();
    const rect = input.nativeElement.getBoundingClientRect();
    const isInputFocus = rect.right >= event.clientX;
    if (isInputFocus) {
      input.nativeElement.focus();
    } else {
      const select = this.select();
      select?.focus();
      select?.open();
    }
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy.set(ids.join(' '));
  }

  // ControlValueAccessor implementation
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (_: unknown) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(value: NumberUnit | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Helper method for number parsing
  private parseNumberValue(valueAsString: string | null): number | null {
    if (!valueAsString) return null;
    // The directive already handles parsing, we just convert comma-formatted string to number
    const stringValue = String(valueAsString)
      .replace(/\s/g, '')
      .replace(',', '.');
    const parsed = parseFloat(stringValue);
    return isNaN(parsed) ? null : parsed;
  }
}

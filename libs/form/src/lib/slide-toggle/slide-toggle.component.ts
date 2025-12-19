import { FocusMonitor } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Input,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Subject } from 'rxjs';

export interface StoSlideToggleChange {
  source: SlideToggleComponent;
  checked: boolean;
}

@Component({
  selector: 'sto-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: SlideToggleComponent },
  ],
  imports: [MatSlideToggleModule, ReactiveFormsModule],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
    '[class.floating]': 'shouldLabelFloat',
  },
})
export class SlideToggleComponent
  implements ControlValueAccessor, MatFormFieldControl<boolean>
{
  readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly fm = inject(FocusMonitor);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private static nextId = 0;
  readonly stateChanges = new Subject<void>();
  readonly controlType = 'slide-toggle';
  readonly ctrl = new FormControl<boolean | null>(null);

  readonly id = `sto-slide-toggle-${SlideToggleComponent.nextId++}`;
  describedBy = '';

  readonly slideToggle = viewChild.required(MatSlideToggle);

  // Internal signals for reactive state
  private readonly _focused = signal(false);
  private readonly _errorState = signal(false);
  private _disabled = signal(false);
  private _required = signal(false);
  private _value = signal<boolean | null>(null);

  // Signal inputs (not part of MatFormFieldControl interface) - must be public for template binding
  readonly _readonly = input(false, {
    transform: booleanAttribute,
    alias: 'readonly',
  });
  readonly color = input<ThemePalette>('primary');

  // Outputs
  readonly toggled = output<StoSlideToggleChange>();

  // MatFormFieldControl requirements
  placeholder = '';
  autofilled = false;

  // Expose readonly as a property for FormFieldDirective compatibility
  get readonly(): boolean {
    return this._readonly();
  }

  get focused(): boolean {
    return this._focused();
  }

  get errorState(): boolean {
    return this._errorState();
  }

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled();
  }
  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required();
  }
  set required(value: boolean) {
    this._required.set(value);
  }

  @Input()
  get value(): boolean | null {
    return this._value();
  }
  set value(val: boolean | null) {
    this._value.set(val);
  }

  get shouldLabelFloat() {
    return this._focused() || !this.empty;
  }

  get empty() {
    const value = this.ctrl.value;
    return value === null || value === undefined;
  }

  constructor() {
    // Setup CVA
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    // Monitor focus
    this.fm
      .monitor(this.elRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((origin) => {
        this._focused.set(!!origin);
        this.stateChanges.next();
      });

    // Handle value changes
    this.ctrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this._value.set(value);
        this.toggled.emit({
          checked: value ?? false,
          source: this,
        });
        this.onChange(value);
      });

    // Monitor validation state
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((state) => {
          this._errorState.set(state === 'INVALID');
          this.stateChanges.next();
        });
    }

    // Sync state changes and form control state
    effect(() => {
      const isDisabled = this._disabled();
      const isReadonly = this._readonly();
      const newValue = this._value();

      // Track required and color for state changes
      this._required();
      this.color();

      // Sync disabled/readonly to internal form control
      const shouldDisable = isDisabled || isReadonly;
      const opts = { onlySelf: true, emitEvent: false };
      if (shouldDisable !== this.ctrl.disabled) {
        shouldDisable ? this.ctrl.disable(opts) : this.ctrl.enable(opts);
      }

      // Sync value to internal form control
      if (newValue !== this.ctrl.value) {
        this.ctrl.setValue(newValue, { emitEvent: false });
      }

      this.stateChanges.next();
    });
  }

  onContainerClick(): void {
    if (!this._disabled() && !this._readonly()) {
      this.slideToggle()?.focus();
      this.ctrl.setValue(!this.ctrl.value);
    }
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // ControlValueAccessor implementation
  private onChange: (value: boolean | null) => void = () => {};
  private onTouched = () => {};

  writeValue(value: boolean): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: boolean | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

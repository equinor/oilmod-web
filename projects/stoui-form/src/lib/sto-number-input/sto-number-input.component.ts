import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewEncapsulation
} from '@angular/core';
import {StoNumberInputPipe} from './sto-number-input.pipe';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject, Observable} from 'rxjs';
import {StoUserPreferenceService} from '@ngx-stoui/core';

/**
 * The number input is component that formats the number after you blur the field.
 * It is possible to decide how many decimals (fractions) the number can show, input a unit.
 * E.g. 1303200.32 is default formatted to 1 303 200,320
 * Tries to interpret pasted values and export the numberic value to the clipboard.
 * Should handle most common keystrokes as a normal input field.
 */
@Component({
    selector: 'sto-number-input',
    templateUrl: 'sto-number-input.component.html',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => StoNumberInputComponent),
        multi: true
      }
    ],
    styleUrls: ['./sto-number-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
  }
)
export class StoNumberInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  /**
   Syncs a FormControl in an existing FormGroup to a form control element by name.
   Is used to sync the input with the Form.
   */
  @Input() formControlName: string;
  /**
   * Text in the inputfield when no value.
   */
  @Input() placeholder: string;
  /**
   * Label above the inputfield.
   */
  @Input() label: string;
  /**
   *  The alignment of the text.
   */
  @Input() textAlign: 'right' | 'left' = 'right';
  /**
   * How many decimals(fractions) the
   */
  @Input() fractionSize = 3;
  /**
   * A suffix after the number, e.g. "M3"
   */
  @Input() suffix: string;
  /**
   * Make the field as readonly.
   */
  @Input() readonly: boolean;
  /**
   * Disables the field.
   */
  @Input() disabled: boolean;
  /**
   * The position/animation of the label: https://material.angular.io/components/form-field/overview#floating-label
   */
  @Input() floatLabel = 'always';
  /**
   * Disabled styling assosiated with label. Used in tables and such.
   */
  @Input() withoutPlaceHolder: boolean;

  /**
   * Force value is used to set a value, which shall always be display only.
   * When a forceValue is used, no other values will be propagated.
   */
  private _forceValue: any;
  @Input() set forceValue(forceValue) {
    this._forceValue = forceValue;
    this.writeValue(forceValue);
  }

  get forceValue(): any {
    return this._forceValue;
  }

  public $hasSelectAllEnabled: Observable<boolean>;
  public value: any;
  public errors: ValidationErrors | null;
  public touched: any;
  public control = new FormControl();
  private destroyed$ = new Subject();


  /**
   * Listens for changes in form, transforms from string to number.
   * If a forceValue is set, we don't want to propagate that value to the conroller.
   * Return null if NaN.
   */
  private handleChanges() {

    if (!this.forceValue && this.forceValue !== 0) {
      this.control.valueChanges
        .pipe(
          debounceTime(1), // https://github.com/angular/angular/issues/14057
          takeUntil(this.destroyed$)
        )
        .subscribe((value) => {
          let numberValue = parseFloat(this.numberFormatterPipe.parse(value, this.fractionSize));
          numberValue = !isNaN(numberValue) ? numberValue : null;
          this.propagateChange(numberValue);
        });
    }

  }

  /**
   * Sets the init value
   * @param control
   */
  private initForm(control: AbstractControl | null) {
    let value = null;
    if (this.forceValue !== undefined && this.forceValue !== null) {
      value = this.forceValue;
    } else if (control) {
      value = control.value;
    }
    this.writeValue(value);
    if (this.disabled) {
      this.control.disable();
    }
  }

  /**
   * Subscribes for status changes on the parent control and display the errors inside the mat-formfield
   * @param control
   */
  private handleErrors(control: AbstractControl | null) {
    if (control) {
      control.statusChanges
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe(() => {
        this.markErrors(control);
      });
    }

  }

  /**
   * Marks error from control.
   * @param control
   */
  private markErrors(control) {
    this.touched = control.touched;
    this.errors = control.errors;
    this.cdr.markForCheck();
  }


  propagateChange = (_: any) => {
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Write a numeric value to a formatted text value.
   * @param value
   */
  writeValue(value: any) {
    if (value || value === 0) {
      this.control.setValue(this.numberFormatterPipe.transform(value, this.fractionSize), {emitEvent: false});
    } else {
      this.control.setValue(null, {emitEvent: false});
    }
  }


  registerOnTouched() {
  }

  public disable() {

  }

  ngOnInit() {
    let control: FormControl;
    if (this.controlContainer) {
      control = this.controlContainer.control.get(this.formControlName) as FormControl;
    } else {
      control = null;
    }
    if (control) {
      control.registerOnDisabledChange((isDisabled: boolean) => {
        if (isDisabled) {
          this.control.disable();
        } else {
          this.control.enable();
        }

      });
    }

    this.monkeyPatchMarkAsTouched(control);

    this.initForm(control);
    this.handleErrors(control);
    this.handleChanges();
    this.$hasSelectAllEnabled = this.userPreferenceService.hasSelectTextOnFocusEnabled.asObservable();
  }

  /**
   * To react on the manually mark as touched
   * https://github.com/angular/angular/issues/17736
   * @param control
   */
  private monkeyPatchMarkAsTouched(control) {
    if (control) {
      const self = this;
      const origFunc = control.markAsTouched;
      control.markAsTouched = function () {
        origFunc.apply(this, arguments);
        self.markErrors(this);
      };
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * The controlContainer is required to listen for value and status changes and interact with the parent formController.
   */
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    private numberFormatterPipe: StoNumberInputPipe,
    private userPreferenceService: StoUserPreferenceService,
    private cdr: ChangeDetectorRef
  ) {
  }

}

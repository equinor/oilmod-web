import { ChangeDetectorRef, Component, forwardRef, Host, Input, NgModule, OnInit, Optional, SkipSelf } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StoPipesModule } from '@ngx-stoui/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'sto-slide-toggle',
  templateUrl: './sto-slide-toggle.component.html',
  styleUrls: [ './sto-slide-toggle.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoSlideToggleComponent),
      multi: true
    }
  ]
})
/**
 * @deprecated Use SlideToggleComponent instead
 */
export class StoSlideToggleComponent implements ControlValueAccessor, OnInit {

  private destroyed$ = new Subject();
  /**
   * Used to retrieve AbstractControl from the form
   */
  @Input() formControlName: string;
  /**
   * You can also pass in a formControl directly to have it outside a regular form
   */
  @Input() formControl: FormControl;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() textAlign: 'right' | 'left' = 'right';
  @Input() fractionSize = 3;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() floatLabel = 'always';
  @Input() floatPlaceholder = 'always';
  @Input() withoutPlaceHolder: boolean;

  /**
   * Force value is used to set a value, which shall always be display only.
   * When a forceValue is used, no other values will be propagated.
   */
  private _forceValue: any;
  @Input() set forceValue(forceValue) {
    this._forceValue = forceValue;
    if ( forceValue ) {

      this.writeValue(forceValue);
    }

  }

  get forceValue(): any {
    return this._forceValue;
  }


  /**
   * Value should not normally be used, will be overwtit
   */
  public value: any;
  public errors: string[] = [];
  public touched: any;
  public control = new FormControl();


  /**
   * Listens for changes in form, transforms from string to number.
   * If a forceValue is set, we don't want to propagate that value to the conroller.
   * Return null if NaN.
   */
  private handleChanges() {

    if ( !this.forceValue && this.forceValue !== 0 ) {
      this.control.valueChanges
        .pipe(
          debounceTime(1), // https://github.com/angular/angular/issues/14057
          takeUntil(this.destroyed$)
        ).subscribe((value) => {
        this.propagateChange(value);
      });
    }

  }

  /**
   * Sets the init value
   */
  private initForm(control: AbstractControl | null) {
    let value = null;
    if ( this.forceValue !== undefined && this.forceValue !== null ) {
      value = this.forceValue;
    } else {
      value = control.value;
    }
    this.writeValue(value);
    if ( this.disabled ) {
      this.control.disable();
    }
  }

  /**
   * Subscribes for status changes on the parent control and display the errors inside the mat-formfield
   */
  private handleErrors(control: AbstractControl | null) {
    if ( control ) {
      control.statusChanges
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe(() => {
        this.markErrors(control);
        this.handleParentState(control);
      });
    }

  }

  private handleParentState(control: AbstractControl) {
    if ( control.disabled && !this.disabled ) {
      this.disabled = true;
      this.control.disable();
    }
    if ( control.enabled && this.disabled ) {
      this.disabled = false;
      this.control.enable();
    }
  }

  private markErrors(control) {
    this.touched = control.touched || control.dirty;
    this.errors = control.errors ? Object.values(control.errors) : [];
  }


  propagateChange = (_: any) => {
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value: any) {
    if ( value ) {
      this.control.setValue(true, { emitEvent: false });
    } else {
      this.control.setValue(false, { emitEvent: false });
    }
  }


  registerOnTouched() {
  }

  public disable() {

  }


  ngOnInit() {
    console.warn('StoSlideToggleModule has been deprecated. Use SlideToggleModule instead.');
    let control;
    if ( this.formControl ) {
      control = this.formControl;
    } else if (this.controlContainer) {
      control = this.controlContainer.control.get(this.formControlName) as FormControl;
    }
    if ( control ) {
      control.registerOnDisabledChange((isDisabled: boolean) => {
        if ( isDisabled ) {
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
    setTimeout(() => this.cdr.markForCheck(), 100);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * To react on the manually mark as touched
   * https://github.com/angular/angular/issues/17736
   * @param control
   */
  private monkeyPatchMarkAsTouched(control) {
    if ( control ) {
      const self = this;
      const origFunc = control.markAsTouched;
      control.markAsTouched = function () {
        origFunc.apply(this, arguments);
        self.markErrors(this);
      };
    }
  }

  /**
   * The controlContainer is required to listen for value and status changes and interact with the parent formController.
   */
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef
  ) {
  }


  onFocus($event, element) {
    if ( this.disabled ) {
      return;
    }
    element.focused = true;
  }

  onBlur($event, element) {
    if ( this.disabled ) {
      return;
    }
    element.focused = false;
  }

  public toggle($event, slider, input) {
    if ( this.disabled ) {
      return;
    }
    $event.preventDefault();
    slider.toggle();
    this.control.markAsDirty();
    this.control.setValue(slider.checked);
    try {
      this.controlContainer.control.markAsDirty();
    } catch {/**them all*/
    }
    setTimeout(() => input._elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.focus(), 0);
  }


}

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , MatInputModule
    , MatSlideToggleModule
    , StoPipesModule
  ],
  exports: [ StoSlideToggleComponent ],
  declarations: [ StoSlideToggleComponent ]

})
/**
 * @deprecated StoSlideToggleModule has been deprecated. Use SlideToggleModule instead.
 */
export class StoSlideToggleModule {
}




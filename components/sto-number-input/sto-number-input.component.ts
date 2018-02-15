import {
    AbstractControl, ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors
} from '@angular/forms';
import { Component, forwardRef, Host, HostBinding, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import {StoNumberInputPipe} from './sto-number-input.pipe';


@Component({
        selector: 'sto-number-input',
        templateUrl: 'sto-number-input.component.html',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => StoNumberInputComponent),
                multi: true
            }
        ]
    }
)
export class StoNumberInputComponent implements ControlValueAccessor, OnInit {

    @Input() formControlName: string;
    @Input() placeholder: string;
    @Input() label: string;
    @Input() textAlign: 'right' | 'left' = 'right';
    @Input() fractionSize = 3;
    @Input() suffix: string;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() floatPlaceholder = 'always';
    @Input() withoutPlaceHolder: boolean;

    /**
     * Force value is used to set a value, which shall always be display only.
     * When a forceValue is used, no other values will be propagated.
     */
    private _forceValue: any;
    @Input() set forceValue(forceValue){
        this._forceValue = forceValue;
        this.writeValue(forceValue);
    }
    get forceValue(): any{
        return this._forceValue;
    }


    /**
     * Value should not normally be used, will be overwtit
     */
    public value: any;

    public errors: ValidationErrors | null;
    public touched: any;
    public control = new FormControl();



    /**
     * Listens for changes in form, transforms from string to number.
     * If a forceValue is set, we don't want to propagate that value to the conroller.
     * Return null if NaN.
     */
    private handleChanges(){
        if(!this.forceValue && this.forceValue !== 0){
            this.control.valueChanges
              .debounceTime(1) // https://github.com/angular/angular/issues/14057
              .subscribe((value) => {
                  let numberValue =  parseFloat(this.numberFormatterPipe.parse(value, this.fractionSize));
                  numberValue = !isNaN(numberValue) ? numberValue : null;
                  this.propagateChange(numberValue);
              });
        }

    }

    /**
     * Sets the init value
     * @param {AbstractControl | null} control
     */
    private initForm(control: AbstractControl | null) {
        let value = null;
        if(this.forceValue !== undefined && this.forceValue !== null){
           value = this.forceValue;
        }
        else{
            value = control.value;
        }
        this.writeValue(value);
        if(this.disabled){
            this.control.disable();
        }
    }

    /**
     * Subscribes for status changes on the parent control and display the errors inside the mat-formfield
     * @param {AbstractControl | null} control
     */
    private handleErrors(control: AbstractControl | null) {
        if(control){
            control.statusChanges.subscribe(() => {
                this.markErrors(control);
            });
        }

    }

    private markErrors(control){
        this.touched = control.touched;
        this.errors = control.errors;
    }



    propagateChange = (_: any) => {
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value: any) {
        if(value || value === 0){
            this.control.setValue(this.numberFormatterPipe.transform(value, this.fractionSize));
        }

    }

    registerOnTouched() {
    }

    public disable(){

    }

    ngOnInit() {
        const control = this.controlContainer.control.get(this.formControlName) as FormControl;
        if(control){
            control.registerOnDisabledChange((isDisabled: boolean) => {
                if(isDisabled){
                    this.control.disable();
                }
                else{
                    this.control.enable();
                }

            });
        }

        this.monkeyPatchMarkAsTouched(control);

        this.initForm(control);
        this.handleErrors(control);
        this.handleChanges();
    }

    /**
     * To react on the manually mark as touched
     * https://github.com/angular/angular/issues/17736
     * @param control
     */
    private monkeyPatchMarkAsTouched(control){
        const self = this;
        const origFunc = control.markAsTouched;
        control.markAsTouched = function () {
            origFunc.apply(this, arguments);
            self.markErrors(this);
        }
    }

    /**
     * The controlContainer is required to listen for value and status changes and interact with the parent formController.
     * @param {ControlContainer} controlContainer
     * @param {StoNumberInputPipe} numberFormatterPipe
     */
    constructor (
        @Optional() @Host() @SkipSelf()
        private controlContainer: ControlContainer,
        private numberFormatterPipe: StoNumberInputPipe
    ) {
    }

}

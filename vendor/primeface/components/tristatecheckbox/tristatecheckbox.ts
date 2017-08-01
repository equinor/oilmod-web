import {NgModule,Component,Input,Output,EventEmitter,forwardRef,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const TRISTATECHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TriStateCheckbox),
  multi: true
};

export class TriStateCheckbox implements ControlValueAccessor  {
    
    constructor(private cd: ChangeDetectorRef) {}

    @Input() disabled: boolean;
    
    @Input() name: string;

    @Input() tabindex: number;

    @Input() inputId: string;
    
    @Output() onChange: EventEmitter<any> = new EventEmitter();
        
    focus: boolean;

    value: any;

    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
    
    onClick(event: Event, input: HTMLInputElement) {
        if(!this.disabled) {
            this.toggle(event);
            this.focus = true;
            input.focus();
        }
    }
    
    onKeydown(event: KeyboardEvent) {
        if(event.keyCode == 32) {
            event.preventDefault();
        }
    }
    
    onKeyup(event: KeyboardEvent) {
        if(event.keyCode == 32) {
            this.toggle(event);
            event.preventDefault();
        }
    }
    
    toggle(event: Event) {
        if(this.value == null || this.value == undefined)
            this.value = true;
        else if(this.value == true)
            this.value = false;
        else if(this.value == false)
            this.value = null;
            
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        })
    }
    
    onFocus() {
        this.focus = true;
    }
    
    onBlur() {
        this.focus = false;
        this.onModelTouched();
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    writeValue(value: any) : void {
        this.value = value;
        this.cd.markForCheck();
    }
    
    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }
}

export class TriStateCheckboxModule { }
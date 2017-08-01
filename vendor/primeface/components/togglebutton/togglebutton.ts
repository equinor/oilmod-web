import {NgModule,Component,Input,Output,EventEmitter,forwardRef,AfterViewInit,ViewChild,ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const TOGGLEBUTTON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleButton),
  multi: true
};

export class ToggleButton implements ControlValueAccessor,AfterViewInit {

    @Input() onLabel: string = 'Yes';

    @Input() offLabel: string = 'No';

    @Input() onIcon: string;

    @Input() offIcon: string;

    @Input() disabled: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() inputId: string;

    @Input() tabindex: number;

    @Output() onChange: EventEmitter<any> = new EventEmitter();
    
    @ViewChild('checkbox') checkboxViewChild: ElementRef;
    
    checkbox: HTMLInputElement;
    
    checked: boolean = false;

    focus: boolean = false;
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
    
    ngAfterViewInit() {
        this.checkbox = <HTMLInputElement> this.checkboxViewChild.nativeElement;
    }

    getIconClass() {
        let baseClass = 'ui-button-icon-left fa fa-fw';
        return baseClass + ' ' + (this.checked ? this.onIcon : this.offIcon);
    }
    
    toggle(event: Event) {
        if(!this.disabled) {
            this.checked = !this.checked;
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            this.checkbox.focus();
        }
    }

    onFocus() {
        this.focus = true;
    }
    
    onBlur() {
        this.focus = false;
        this.onModelTouched();
    }
    
    writeValue(value: any) : void {
        this.checked = value;
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    
    setDisabledState(val: boolean): void {
        this.disabled = val;
    }
}

export class ToggleButtonModule { }
import {NgModule,Directive,ElementRef,HostListener,Input,DoCheck} from '@angular/core';
import {CommonModule} from '@angular/common';

export class InputText implements DoCheck {

    filled: boolean;

    constructor(public el: ElementRef) {}
        
    ngDoCheck() {
        this.updateFilledState();
    }
    
    //To trigger change detection to manage ui-state-filled for material labels when there is no value binding
    @HostListener('input', ['$event']) 
    onInput(e) {
        this.updateFilledState();
    }
    
    updateFilledState() {
        this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    }
}

export class InputTextModule { }
import {NgModule,Component,Input,Output,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from '../button/button';

export class InplaceDisplay {}

export class InplaceContent {}

export class Inplace {
        
    @Input() active: boolean;
    
    @Input() closable: boolean;
    
    @Input() disabled: boolean;

    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() onActivate: EventEmitter<any> = new EventEmitter();
    
    @Output() onDeactivate: EventEmitter<any> = new EventEmitter();
    
    hover: boolean;
    
    activate(event) {
        if(!this.disabled) {
            this.active = true;
            this.onActivate.emit(event);
        }
    }
    
    deactivate(event) {
        if(!this.disabled) {
            this.active = false;
            this.hover = false;
            this.onDeactivate.emit(event);
        }
    }
}

export class InplaceModule { }
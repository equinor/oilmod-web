import {NgModule,Component,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../common/shared';
import {BlockableUI} from '../common/api';

export class Fieldset implements BlockableUI {

    @Input() legend: string;

    @Input() toggleable: boolean;

    @Input() collapsed: boolean = false;

    @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

    @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();
    
    @Input() style: any;
        
    @Input() styleClass: string
    
    public animating: boolean;
    
    constructor(private el: ElementRef) {}
        
    toggle(event) {
        if(this.toggleable) {
            this.animating = true;
            this.onBeforeToggle.emit({originalEvent: event, collapsed: this.collapsed});
            
            if(this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
                
            this.onAfterToggle.emit({originalEvent: event, collapsed: this.collapsed});   
            
            //TODO: Use onDone of animate callback instead with RC6
            setTimeout(() => {
                this.animating = false;
            }, 400);
        }
    }
    
    expand(event) {
        this.collapsed = false;
    }
    
    collapse(event) {
        this.collapsed = true;
    }
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

}

export class FieldsetModule { }
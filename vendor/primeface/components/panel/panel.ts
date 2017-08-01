import {NgModule,Component,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../common/shared';
import {BlockableUI} from '../common/api';
import {trigger,state,style,transition,animate} from '@angular/animations';

export class Panel implements BlockableUI {

    @Input() toggleable: boolean;

    @Input() header: string;

    @Input() collapsed: boolean = false;
    
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

    @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();
        
    public animating: boolean;
    
    constructor(protected el: ElementRef) {}
    
    toggle(event) {
        if(this.animating) {
            return false;
        }
        
        this.animating = true;
        this.onBeforeToggle.emit({originalEvent: event, collapsed: this.collapsed});
        
        if(this.toggleable) {            
            if(this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        
        this.onAfterToggle.emit({originalEvent: event, collapsed: this.collapsed});   
                
        event.preventDefault();
    }
    
    expand(event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    }
    
    collapse(event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    }
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
    
    onToggleDone(event: Event) {
        this.animating = false;
    }

}

export class PanelModule { }
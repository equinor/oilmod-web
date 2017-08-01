import {NgModule,Component,Input,Output,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/api';
import {Router} from '@angular/router';

export class Steps {
    
    @Input() activeIndex: number = 0;
    
    @Input() model: MenuItem[];
    
    @Input() readonly: boolean =  true;
    
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() activeIndexChange: EventEmitter<any> = new EventEmitter();
    
    constructor(public router: Router) {}
    
    itemClick(event: Event, item: MenuItem, i: number) {
        if(this.readonly) {
            return;
        }
        
        this.activeIndexChange.emit(i);
        
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
        
        if(item.command) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item,
                index: i
            });
        }
        
        if(item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }
    
}

export class StepsModule { }
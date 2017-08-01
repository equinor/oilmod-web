import {NgModule,Component,Input,OnDestroy,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/api';
import {Location} from '@angular/common';
import {RouterModule} from '@angular/router';

export class Breadcrumb implements OnDestroy {

    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() home: MenuItem;
        
    itemClick(event, item: MenuItem) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url) {
            event.preventDefault();
        }
        
        if(item.command) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }
    }
    
    onHomeClick(event) {
        if(this.home) {
            this.itemClick(event, this.home);
        }
    }
        
    ngOnDestroy() {
        if(this.model) {
            for(let item of this.model) {
                if(item.eventEmitter) {
                    item.eventEmitter.unsubscribe();
                }
            }
        }
    }

}

export class BreadcrumbModule { }
import {NgModule,Component,ElementRef,OnDestroy,Input,EventEmitter} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/api';
import {RouterModule} from '@angular/router';

export class BasePanelMenuItem {
        
    handleClick(event, item) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        item.expanded = !item.expanded;
        
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
}

export class PanelMenuSub extends BasePanelMenuItem {
    
    @Input() item: MenuItem;
    
    @Input() expanded: boolean;
}

export class PanelMenu extends BasePanelMenuItem {
    
    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    public animating: boolean;
                
    unsubscribe(item: any) {
        if(item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }
        
        if(item.items) {
            for(let childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }
            
    ngOnDestroy() {        
        if(this.model) {
            for(let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }
    
    handleClick(event, item) {
        this.animating = true;
        super.handleClick(event, item);
        //TODO: Use onDone of animate callback instead with RC6
        setTimeout(() => {
            this.animating = false;
        }, 400);
    }

}

export class PanelMenuModule { }

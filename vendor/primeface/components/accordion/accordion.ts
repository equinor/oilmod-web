import {NgModule,Component,ElementRef,AfterContentInit,Input,Output,EventEmitter,ContentChildren,QueryList} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {Header} from '../common/shared';
import {BlockableUI} from '../common/api';

export class Accordion implements BlockableUI {
    
    @Input() multiple: boolean;
    
    @Output() onClose: EventEmitter<any> = new EventEmitter();

    @Output() onOpen: EventEmitter<any> = new EventEmitter();

    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() lazy: boolean;
    
    public tabs: AccordionTab[] = [];

    constructor(public el: ElementRef) {}

    addTab(tab: AccordionTab) {
        this.tabs.push(tab);
    }   
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    } 
}

export class AccordionTab {

    @Input() header: string;

    @Input() selected: boolean;

    @Input() disabled: boolean;
    
    @Output() selectedChange: EventEmitter<any> = new EventEmitter();

    @ContentChildren(Header) headerFacet: QueryList<AccordionTab>;
    
    public animating: boolean;
    
    constructor(public accordion: Accordion) {
        this.accordion.addTab(this);
    }

    toggle(event) {
        if(this.disabled || this.animating) {
            return false;
        }
        
        this.animating = true;
        let index = this.findTabIndex();

        if(this.selected) {
            this.selected = false;
            this.accordion.onClose.emit({originalEvent: event, index: index});
        }
        else {
            if(!this.accordion.multiple) {
                for(var i = 0; i < this.accordion.tabs.length; i++) {
                    this.accordion.tabs[i].selected = false;
                    this.accordion.tabs[i].selectedChange.emit(false);
                }
            }

            this.selected = true;
            this.accordion.onOpen.emit({originalEvent: event, index: index});
        }
        
        this.selectedChange.emit(this.selected);
        
        event.preventDefault();
    }

    findTabIndex() {
        let index = -1;
        for(var i = 0; i < this.accordion.tabs.length; i++) {
            if(this.accordion.tabs[i] == this) {
                index = i;
                break;
            }
        }
        return index;
    }
    
    get lazy(): boolean {
        return this.accordion.lazy;
    }
    
    get hasHeaderFacet(): boolean {
        return this.headerFacet && this.headerFacet.length > 0;
    }
    
    onToggleDone(event: Event) {
        this.animating = false;
    }
}

export class AccordionModule { }

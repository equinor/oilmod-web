import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,ViewChild,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Message} from '../common/api';
import {DomHandler} from '../dom/domhandler';

export class Growl implements AfterViewInit,OnDestroy {

    @Input() sticky: boolean = false;

    @Input() life: number = 3000;
        
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() valueChange: EventEmitter<Message[]> = new EventEmitter<Message[]>();
    
    @ViewChild('container') containerViewChild: ElementRef;
    
    _value: Message[];
            
    zIndex: number;
    
    container: HTMLDivElement;
        
    timeout: any;
        
    constructor(public el: ElementRef, public domHandler: DomHandler) {
        this.zIndex = DomHandler.zindex;
    }

    ngAfterViewInit() {
        this.container = <HTMLDivElement> this.containerViewChild.nativeElement;
    }
    
    @Input() get value(): Message[] {
        return this._value;
    }

    set value(val:Message[]) {
        this._value = val;
        if(this.container) {
            this.handleValueChange();
        }
    }
    
    handleValueChange() {
        this.zIndex = ++DomHandler.zindex;
        this.domHandler.fadeIn(this.container, 250);
        
        if(!this.sticky) {
            if(this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.removeAll();
            }, this.life);
        }
    }
        
    remove(index: number, msgel: any) {        
        this.domHandler.fadeOut(msgel, 250);
        
        setTimeout(() => {
            this.value = this.value.filter((val,i) => i!=index);
            this.valueChange.emit(this.value);
        }, 250);
        
    }
    
    removeAll() {
        if(this.value && this.value.length) {            
            this.domHandler.fadeOut(this.container, 250);
            
            setTimeout(() => {
                this.value = [];
                this.valueChange.emit(this.value);
            }, 250);
        }
    }
    
    ngOnDestroy() {
        if(!this.sticky) {
            clearTimeout(this.timeout);
        }
    }

}

export class GrowlModule { }

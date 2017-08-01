import {NgModule,Component,AfterViewInit,AfterViewChecked,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';

export class Terminal implements AfterViewInit,AfterViewChecked {

    @Input() welcomeMessage: string;

    @Input() prompt: string;
        
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() responseChange: EventEmitter<any> = new EventEmitter();

    @Output() handler: EventEmitter<any> = new EventEmitter();
        
    commands: any[] = [];
    
    command: string;
    
    container: Element;
    
    commandProcessed: boolean;
    
    constructor(public el: ElementRef, public domHandler: DomHandler) {}
    
    ngAfterViewInit() {
        this.container = this.domHandler.find(this.el.nativeElement, '.ui-terminal')[0];
    }
    
    ngAfterViewChecked() {
        if(this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }
                
    @Input()
    set response(value: string) {
        if(value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }
    
    handleCommand(event: KeyboardEvent) {
        if(event.keyCode == 13) {
            this.commands.push({text: this.command});                    
            this.handler.emit({originalEvent: event, command: this.command});
            this.command = '';
        }
    }
    
    focus(element: HTMLElement) {
        element.focus();
    }
    
}

export class TerminalModule { }
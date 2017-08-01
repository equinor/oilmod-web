import {NgModule,Component,Input,Output,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

export class Toolbar {
    
    @Input() style: any;
        
    @Input() styleClass: string;

}

export class ToolbarModule { }
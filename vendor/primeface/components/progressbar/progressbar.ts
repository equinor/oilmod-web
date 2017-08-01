import {NgModule,Component,Input} from '@angular/core';
import {CommonModule} from '@angular/common';

export class ProgressBar {

    @Input() value: any;
    
    @Input() showValue: boolean = true;

    @Input() unit: string = '%';
    
}

export class ProgressBarModule { }
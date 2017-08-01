import {NgModule,Directive,ElementRef,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

declare var Prism: any;

export class CodeHighlighter implements OnInit {

    constructor(public el: ElementRef) {}
    
    ngOnInit() {
        Prism.highlightElement(this.el.nativeElement);
    }
}

export class CodeHighlighterModule { }



import { Directive, ElementRef, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Prism: any;
/**
 * Decided not to rename these modules, as they are currently only used for the showcase
 */
@Directive({
  'selector': '[stoCode]'
})
export class CodeHighlighter implements OnInit {

  constructor(public el: ElementRef) {
  }

  ngOnInit() {
    Prism.highlightElement(this.el.nativeElement);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [CodeHighlighter],
  declarations: [CodeHighlighter]
})
export class CodeHighlighterModule {
}



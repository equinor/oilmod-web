import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { MatMonthPicker } from './datepicker';

@Directive({
  selector: '[stoMonthFormFieldClick]'
})
export class StoMonthFormFieldClickDirective implements OnInit {
  constructor() { }

  @Input() stoMonthFormFieldClick: MatMonthPicker<any>; //calendar

  ngOnInit() { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.stoMonthFormFieldClick.open();
  }
}
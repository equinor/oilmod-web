import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { MatMonthPicker } from './datepicker';

/**
 * Directive that opens the monthPicker from the input field.
 */
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
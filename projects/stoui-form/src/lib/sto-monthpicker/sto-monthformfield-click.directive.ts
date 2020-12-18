import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { MatMonthPicker } from './datepicker';

/**
 * Directive that opens the monthPicker from the input field.
 */
@Directive({
  selector: '[stoMonthFormFieldClick]'
})
export class StoMonthFormFieldClickDirective implements OnInit {

  @Input() stoMonthFormFieldClick: MatMonthPicker<any>; // calendar
  constructor() {
  }

  ngOnInit() {
  }

  @HostListener('click', [ '$event' ])
  clickEvent(event) {
    this.stoMonthFormFieldClick.open();
  }
}

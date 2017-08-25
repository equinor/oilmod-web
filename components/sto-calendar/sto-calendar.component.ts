import { ChangeDetectorRef, Component, ElementRef, forwardRef, NgModule, Renderer, Input } from '@angular/core';
import { Calendar } from '../../vendor/primeface/components/calendar/calendar';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValid } from 'date-fns';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StoCalendarComponent),
  multi: true
};

export const CALENDAR_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => StoCalendarComponent),
  multi: true
};

export interface LocaleSettings {
  firstDayOfWeek?: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
}

@Component({
  selector: 'sto-calendar',
  templateUrl: 'sto-calendar.component.html',
  styleUrls: ['sto-calendar.component.scss'],
  animations: [
    trigger('overlayState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
  providers: [DomHandler, CALENDAR_VALUE_ACCESSOR, CALENDAR_VALIDATOR]
})
export class StoCalendarComponent extends Calendar {

  @Input() dateFormat: string = 'yy-M-dd';
  @Input() selectOtherMonths = true;

  _locale: LocaleSettings = {
    firstDayOfWeek: 1,
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
    monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
    monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  };

  writeValue(value: any) : void {
    if (value) {
      let tempValue = typeof value === 'string' ? new Date(value) : value;
      this.value = isValid(tempValue) ? tempValue : null;
      if(this.value && typeof this.value === 'string') {
        this.value = this.parseValueFromString(this.value);
      }
    }

    this.updateInputfield();
    this.updateUI();
  }


  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public cd: ChangeDetectorRef) {
    super(el, domHandler, renderer, cd);
  }
}

@NgModule({
  imports: [CommonModule, StoButtonModule],
  exports: [StoCalendarComponent, StoButtonModule],
  declarations: [StoCalendarComponent]
})
export class StoCalendarModule {
}

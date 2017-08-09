import { ChangeDetectorRef, Component, ElementRef, forwardRef, NgModule, Renderer, Input } from '@angular/core';
import { Calendar } from '../../vendor/primeface/components/calendar/calendar';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

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

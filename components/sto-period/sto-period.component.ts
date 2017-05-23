import { ChangeDetectorRef, Component, ElementRef, forwardRef, NgModule, Renderer } from '@angular/core';
import { Calendar } from '../../vendor/primeface/components/calendar/calendar';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { CommonModule, DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

export const PERIOD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StoPeriodComponent),
  multi: true
};

export const PERIOD_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => StoPeriodComponent),
  multi: true
};

@Component({
  selector: 'sto-period',
  templateUrl: './sto-period.component.html',
  styleUrls: ['./sto-period.component.scss'],
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
  providers: [DomHandler, PERIOD_VALUE_ACCESSOR, PERIOD_VALIDATOR]
})
export class StoPeriodComponent extends Calendar {

  public datePipe = new DatePipe('en-us');

  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public cd: ChangeDetectorRef) {
    super(el, domHandler, renderer, cd);
  }

  public moveYear(direction) {
    switch (direction) {
      case '+':
        this.currentYear += 1;
        break;
      case '-':
        this.currentYear -= 1;
        break;
    }
  }

  public isCurrentMonth(m: number) {
    const current = new Date().getMonth();
    return current === m;
  }

  public isSelectedMonth(m: number) {
    return this.datePipe.transform(new Date(this.currentYear, m, 1), 'y-MMM') === this.inputFieldValue;
  }

  public newMonth(month: number) {

    const fakeEvent = {
      preventDefault: function () {
      }
    };
    this.onDateSelect(fakeEvent, {
      day: 1,
      month,
      selectable: true,
      today: false,
      year: this.currentYear
    });
  }

  public months = [
    [{
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 0,
      label: 'Jan'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 1,
      label: 'Feb'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 2,
      label: 'Mar'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 3,
      label: 'Apr'
    }], [{
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 4,
      label: 'May'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 5,
      label: 'Jun'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 6,
      label: 'Jul'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 7,
      label: 'Aug'
    }], [{
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 8,
      label: 'Sep'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 9,
      label: 'Oct'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 10,
      label: 'Nov'
    }, {
      day: 1,
      selectable: true,
      today: false,
      year: this.currentYear,
      month: 11,
      label: 'Dec'
    }]
  ];

  public monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

@NgModule({
  imports: [CommonModule, StoButtonModule],
  exports: [StoPeriodComponent, StoButtonModule],
  declarations: [StoPeriodComponent]
})
export class StoPeriodModule {
}

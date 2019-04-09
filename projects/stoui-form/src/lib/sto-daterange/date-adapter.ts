import { MatDateFormats, NativeDateAdapter } from '@angular/material';
import { format, isValid } from 'date-fns';

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: { year: 'numeric', month: 'short', day: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

export class DateRangeAdapter extends NativeDateAdapter {
  getFirstDayOfWeek() {
    return 1;
  }

  format(date: Date, displayFormat: Object) {
    if ( !isValid(date) ) {
      console.error(`Unable to format invalid date: ${date}`);
    }
    if ( displayFormat.hasOwnProperty('day') ) {
      return format(date, 'YYYY-MM-DD');
    } else if ( displayFormat.hasOwnProperty('month') ) {
      return format(date, 'MMM YYYY');
    } else {
      return format(date, 'YYYY');
    }
  }
}

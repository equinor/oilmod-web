import { Pipe, PipeTransform } from '@angular/core';
import { format as formatDate } from 'date-fns';

/**
 * Pipe used to transform dates, based on our default formats.
 *
 * @example
 *
 * public date = "2018-08-27 14:00:30"
 * <span>{{ date | dateFormat }}</span> -> Aug 27, 2018
 * <span>{{ date | dateFormat:'long' }}</span> -> Monday Aug 27, 2018
 */

@Pipe({
  name: 'formatDate'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, format?: string): string {
    if (!value) {
      return null;
    }
    switch (format) {
      case 'long':
        return formatDate(value, 'dddd MMM D, YYYY');
      case 'short':
        return formatDate(value, 'YYYY-MM-DD');
      case 'datetime':
        return formatDate(value, 'MMM D, YYYY, HH:mm');
      case 'datetimezone':
        return formatDate(value, 'MMM D, YYYY, HH:mm:ss (UTCZ)');
      case 'datetime-long':
        return formatDate(value, 'dddd MMM DD, YYYY, HH:mm');
      case 'datetime-short':
        return formatDate(value, 'YYYY-MM-DD, HH:mm');
      default:
        return formatDate(value, 'MMM D, YYYY');
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { format as formatDate, parseISO } from 'date-fns';

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

  transform(value: string | number | Date | null, format?: string): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      value = parseISO(value);
    }
    switch (format) {
      case 'long':
        return formatDate(value, 'EEEE MMM d, yyyy');
      case 'short':
        return formatDate(value, 'yyyy-MM-dd');
      case 'datetime':
        return formatDate(value, 'MMM d, yyyy, HH:mm');
      case 'datetimezone':
        return formatDate(value, `MMM d, yyyy, HH:mm:ss ('UTC'xxx)`);
      case 'datetime-long':
        return formatDate(value, 'EEEE MMM dd, yyyy, HH:mm');
      case 'datetime-short':
        return formatDate(value, 'yyyy-MM-dd, HH:mm');
      default:
        return formatDate(value, 'MMM d, yyyy');
    }
  }

}

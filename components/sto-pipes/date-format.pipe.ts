import { Pipe, PipeTransform } from '@angular/core';
import { format as formatDate } from 'date-fns';

@Pipe({
  name: 'formatDate'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, format?: 'long'|'short'): string {
    if (!value) {
      return null;
    }
    switch (format) {
      case 'long':
        return formatDate(value, 'MMMM DD, YYYY HH:mm');
      case 'short':
        return formatDate(value, 'YY-MM-DD');
      default:
        return formatDate(value, 'MMM DD, YYYY');
    }
  }

}

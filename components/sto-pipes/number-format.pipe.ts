import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, unit: string = '', abs?: boolean, appendDecimals = true): string {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      value = parseFloat(value);
      if (isNaN(value)) {
        return '';
      }
    }
    if (abs) {
      value = Math.abs(value);
    }
    const intl = new Intl.NumberFormat().format(value);
    const split = intl.split('.');
    if(appendDecimals){
      const decimals = split.length === 2 ? split[1] : '';
      split[1] = decimals.padEnd(3, '0');
    }
    const localized = split.join('.');
    return localized.replace(/,/g, ' ').replace('.', ',') + ` ${unit}`;
  }
}

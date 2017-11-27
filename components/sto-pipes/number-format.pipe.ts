import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, unit: string = '', abs?: boolean, appendDecimals = true): string {
    if (value !== 0 && !value) {
      return value as any;
    }
    if (typeof value === 'string') {
      const newValue = parseFloat(value);
      if (isNaN(newValue)) {
        return null;
      }
      value = newValue;
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

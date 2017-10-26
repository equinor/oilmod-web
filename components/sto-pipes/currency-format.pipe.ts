import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
}) 
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, unit: string = ''): string {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      value = parseFloat(value);
      if (isNaN(value)) {
        return '';
      }
    }

    const intl = new Intl.NumberFormat().format(value);
    return intl.replace(/,/g, ' ').replace('.', ',') + ` ${unit}`;
  }
}


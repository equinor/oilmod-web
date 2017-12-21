import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
}) 
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, unit: string = '', maximumFractionDigits = 3): string {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      value = parseFloat(value);
      if (isNaN(value)) {
        return '';
      }
    }

    const intl = new Intl.NumberFormat('en-US', {maximumFractionDigits}).format(value);
    return intl.replace(/,/g, ' ').replace('.', ',') + ` ${unit}`;
  }
}


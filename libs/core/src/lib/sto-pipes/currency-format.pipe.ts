import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to transform numbers to a currency format
 *
 * @example
 *
 * <span>{{ 5000.5824 | currentFormat:'$':3 }}</span>
 * Results in
 * <span>5 000,582 $</span>
 */
@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, unit: string = '', maximumFractionDigits = 3): string | null {
    if ( !value ) {
      return null;
    }
    if ( typeof value === 'string' ) {
      value = parseFloat(value);
      if ( isNaN(value) ) {
        return '';
      }
    }

    const intl = new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
    return intl.replace(/,/g, ' ').replace('.', ',') + ` ${unit}`;
  }
}


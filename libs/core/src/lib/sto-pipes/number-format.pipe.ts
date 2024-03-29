import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats numbers to use our standard formatting (d ddd,ddd)
 *
 * @example
 *
 * {{ 1234,32 | numberFormat }} -> 1 234,320
 * {{ 1234,32 | numberFormat:'M3' }} -> 1 234,320 M3
 * {{ -1234,32 | numberFormat:'M3':true }} -> 1 234,320 M3
 * {{ 1234,32 | numberFormat:'M3':false:false }} -> 1 234 M3
 * {{ 1234,32 | numberFormat:'M3':false:true:5 }} -> 1 234,32000 M3
 */
@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string, unit: string = '', abs?: boolean, appendDecimals = true, numberOfDecimals = 3): string | null {
    if ( value !== 0 && !value ) {
      return '';
    }
    if ( typeof value === 'string' ) {
      const newValue = parseFloat(value);
      if ( isNaN(newValue) ) {
        return null;
      }
      value = newValue;
    }
    if ( abs ) {
      value = Math.abs(value);
    }
    // We absolute the value to ensure that the rounding rules is always away from zero.
    // 1.5 => 2 and -1.5 => -2
    const isNegativeNumber = value < 0;
    value = Math.abs(value);

    if ( !appendDecimals ) {
      value = Math.round(value);
    }
    if ( !isNaN(value) && appendDecimals ) {
      value = parseFloat(this.toFixed(value, numberOfDecimals));
    }
    // Turn negative numbers back, but only if value is not -0
    // eslint-disable-next-line no-compare-neg-zero
    if ( isNegativeNumber && value !== -0 ) {
      value = value * -1;
    }
    const localized = this.prettyPrintValue(value, appendDecimals, numberOfDecimals);
    return localized.replace(/,/g, ' ').replace('.', ',') + `${unit ? ' ' + unit : ''}`;
  }

  private prettyPrintValue(value: number, appendDecimals: boolean, numberOfDecimals: number) {
    const intlOptions = { minimumFractionDigits: numberOfDecimals, maximumFractionDigits: numberOfDecimals };
    const intl = new Intl.NumberFormat('en-US', intlOptions).format(value);
    const split = intl.split('.');
    let localized = split[ 0 ];

    if ( appendDecimals ) {
      const decimals = split.length === 2 ? split[ 1 ] : '';
      split[ 1 ] = decimals.padEnd(numberOfDecimals, '0');
      localized = split.join('.');
    }
    return localized;
  }

  // Normal toFixed has some issues: https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
  private toFixed(num: number, precision: number) {
    // This method also has some issues - namely, it's unable to parse negative numbers with huge floating points
    // -8.185452315956354e-12 becomes NaN
    let returnValue = ( +( Math.round(+( num + 'e' + precision )) + 'e' + -precision ) );
    if ( isNaN(returnValue) ) {
      returnValue = parseFloat(num.toFixed(precision));
    }
    return returnValue.toFixed(precision);
  }
}

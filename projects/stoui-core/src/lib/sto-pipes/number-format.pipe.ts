import { Pipe, PipeTransform } from '@angular/core';

/**
 * Rounds numbers
 */
@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, unit: string = '', abs?: boolean, appendDecimals = true, numberOfDecimals = 3): string {
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
    // We absolute the value to ensure that the rounding rules is always away from zero.
    // 1.5 => 2 and -1.5 => -2
    const isNegativeNumber = value < 0;
    value = Math.abs(value);

    if (!appendDecimals) {
      value = Math.round(value);
    }
    if (!isNaN(value) && appendDecimals) {
      value = parseFloat(this.toFixed(value, numberOfDecimals));
    }
    //Turn negative numbers back, but only if value is not -0
    if (isNegativeNumber && value !== -0) {
      value = value * -1;
    }
    const localized = this.prettyPrintValue(value, appendDecimals, numberOfDecimals);
    return localized.replace(/,/g, ' ').replace('.', ',') + ` ${unit}`;
  }

  private prettyPrintValue(value: number, appendDecimals: boolean, numberOfDecimals) {
    const intlOptions = {minimumFractionDigits: numberOfDecimals, maximumFractionDigits: numberOfDecimals};
    const intl = new Intl.NumberFormat('en-US', intlOptions).format(value);
    const split = intl.split('.');
    let localized = split[0];

    if (appendDecimals) {
      const decimals = split.length === 2 ? split[1] : '';
      split[1] = decimals.padEnd(numberOfDecimals, '0');
      localized = split.join('.');
    }
    return localized;
  }

  //Normal toFixed has some issues: https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
  private toFixed( num, precision ) {
    // This method also has some issues - namely, it's unable to parse negative numbers with huge floating points
    // -8.185452315956354e-12 becomes NaN
    let returnValue = (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision));
    if (isNaN(returnValue)) {
      returnValue = parseFloat(num.toFixed(precision));
    }
    return returnValue.toFixed(precision);
  }
}

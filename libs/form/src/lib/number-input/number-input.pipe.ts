import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000000';

@Pipe({
  name: 'numberInput',
  standalone: true
})
export class NumberInputPipe implements PipeTransform {

  private DECIMAL_SEPARATOR = ',';
  private THOUSANDS_SEPARATOR = ' ';

  transform(value: number | string | null, fractionSize = 5, dynamicFractionSize = false): string {
    if ( !value && value !== 0 ) {
      return '';
    }
    value = value + '';
    // eslint-disable-next-line
    const re = /[\^¨~`´_:;!"#¤%&/()=@£$€{\[]/g;
    value = value.replace(re, '');

    value = value.replace('.', this.DECIMAL_SEPARATOR);
    const [ integerSplit, fractionSplit = '' ] = value.split(this.DECIMAL_SEPARATOR);
    let { integer, fraction } = this.handleIntegerAndFractions(integerSplit, fractionSplit, fractionSize, dynamicFractionSize);
    if ( integer === null ) {
      return '';
    }
    if ( dynamicFractionSize ) {
      fraction = fraction ? this.DECIMAL_SEPARATOR + ( fraction ) : '';
    } else {
      fraction = fractionSize > 0
        ? this.DECIMAL_SEPARATOR + ( fraction + PADDING ).substring(0, fractionSize)
        : '';
    }

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);


    return integer + fraction;
  }

  parse(value: string, fractionSize = 5, dynamicFractionSize = false): string {
    value = value + '';
    // eslint-disable-next-line
    const re = /[\^¨~`´_:;!"#¤%&/()=@£$€{\[]/g;
    value = value.replace(re, '');
    value = value.replace('.', this.DECIMAL_SEPARATOR);
    // eslint-disable-next-line prefer-const
    let [ integerSplit, fractionSplit = '' ] = ( value || '' ).split(this.DECIMAL_SEPARATOR);

    integerSplit = integerSplit.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');
    // eslint-disable-next-line prefer-const
    let { integer, fraction } = this.handleIntegerAndFractions(integerSplit, fractionSplit, fractionSize, dynamicFractionSize);

    if ( dynamicFractionSize ) {
      fraction = fraction ? `.${fraction}` : '';
    } else {
      fraction = fractionSize > 0
        ? '.' + ( fraction + PADDING ).substring(0, fractionSize)
        : '';
    }


    if ( !integer ) {
      return '';
    }
    return integer + fraction;
  }

  private handleIntegerAndFractions(integer: string, fraction: string, fractionSize: number, dynamicFractionSize = false) {
    const negative = integer.startsWith('-');
    if ( ( integer === '' && fraction === '' ) || integer === 'NaN' ) {
      return { integer: null, fraction: null };
    } else if ( integer === '' ) {
      integer = '0';
    } else if ( integer.includes('-') ) {
      if ( integer === '-' ) {
        integer = '-0';
      } else {
        integer = '-' + parseInt(integer, 10) * -1; // To handle -0.123
      }
    } else {
      integer = parseInt(integer, 10) + '';
    }

    if ( fraction.length > fractionSize && !dynamicFractionSize ) {
      const number = parseFloat('0.' + fraction);
      const exp = Math.pow(10, fractionSize);
      const rounded = Math.round(number * exp) / exp;
      if ( rounded === 1 ) {
        const addValue = negative ? -1 : 1;
        integer = ( parseInt(integer || '0', 10) + addValue ) + '';
        fraction = '';
      } else {
        fraction = ( rounded + '' ).split('.')[ 1 ] || '';
      }
    }

    return { integer, fraction };
  }

}

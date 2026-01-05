import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000000';
const INVALID_CHARS_REGEX = /[\^¨~`´_:;!"#¤%&/()=@£$€{[]/g;

@Pipe({
  name: 'numberInput',
  standalone: true,
})
export class NumberInputPipe implements PipeTransform {
  private readonly DECIMAL_SEPARATOR = ',';
  private readonly THOUSANDS_SEPARATOR = ' ';

  transform(
    value: number | string | null,
    fractionSize = 5,
    dynamicFractionSize = false,
  ): string {
    if (!value && value !== 0) {
      return '';
    }

    const cleaned = this.cleanValue(String(value));
    const [integerSplit, fractionSplit = ''] = cleaned.split(
      this.DECIMAL_SEPARATOR,
    );
    const { integer, fraction } = this.handleIntegerAndFractions(
      integerSplit,
      fractionSplit,
      fractionSize,
      dynamicFractionSize,
    );

    if (integer === null) {
      return '';
    }

    const formattedInteger = integer.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.THOUSANDS_SEPARATOR,
    );
    const formattedFraction = this.formatFraction(
      fraction,
      fractionSize,
      dynamicFractionSize,
      this.DECIMAL_SEPARATOR,
    );

    return formattedInteger + formattedFraction;
  }

  parse(value: string, fractionSize = 5, dynamicFractionSize = false): string {
    const cleaned = this.cleanValue(String(value));
    const [integerSplit, fractionSplit = ''] = cleaned.split(
      this.DECIMAL_SEPARATOR,
    );
    const cleanedInteger = integerSplit.replace(
      new RegExp(this.THOUSANDS_SEPARATOR, 'g'),
      '',
    );
    const { integer, fraction } = this.handleIntegerAndFractions(
      cleanedInteger,
      fractionSplit,
      fractionSize,
      dynamicFractionSize,
    );

    if (!integer) {
      return '';
    }

    const formattedFraction = this.formatFraction(
      fraction,
      fractionSize,
      dynamicFractionSize,
      '.',
    );
    return integer + formattedFraction;
  }

  private cleanValue(value: string): string {
    return value
      .replace(INVALID_CHARS_REGEX, '')
      .replace('.', this.DECIMAL_SEPARATOR);
  }

  private formatFraction(
    fraction: string,
    fractionSize: number,
    dynamicFractionSize: boolean,
    separator: string,
  ): string {
    if (dynamicFractionSize) {
      return fraction ? separator + fraction : '';
    }
    return fractionSize > 0
      ? separator + (fraction + PADDING).substring(0, fractionSize)
      : '';
  }

  private handleIntegerAndFractions(
    integer: string,
    fraction: string,
    fractionSize: number,
    dynamicFractionSize = false,
  ) {
    const negative = integer.startsWith('-');

    if ((integer === '' && fraction === '') || integer === 'NaN') {
      return { integer: null, fraction: null };
    }

    if (integer === '') {
      integer = '0';
    } else if (integer === '-') {
      integer = '-0';
    } else if (integer.includes('-')) {
      integer = String(-1 * parseInt(integer, 10)); // To handle -0.123
    } else {
      integer = String(parseInt(integer, 10));
    }

    if (fraction.length > fractionSize && !dynamicFractionSize) {
      const number = parseFloat(`0.${fraction}`);
      const exp = Math.pow(10, fractionSize);
      const rounded = Math.round(number * exp) / exp;

      if (rounded === 1) {
        const addValue = negative ? -1 : 1;
        integer = String(parseInt(integer || '0', 10) + addValue);
        fraction = '';
      } else {
        fraction = String(rounded).split('.')[1] || '';
      }
    }

    return { integer, fraction };
  }
}

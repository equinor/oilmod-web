import {Pipe, PipeTransform} from '@angular/core';

const PADDING = '000000000';

@Pipe({name: 'stoNumberInputPipe'})
export class StoNumberInputPipe implements PipeTransform {

    private DECIMAL_SEPARATOR = ',';
    private THOUSANDS_SEPARATOR = ' ';

    constructor() {
    }

    private handleIntegerAndFractions(integer: string, fraction: string, fractionSize: number) {

        if ((integer === '' && fraction === '') || integer === 'NaN') {
            return {integer : null, fraction : null}
        }
        else if (integer === '') {
            integer = '0';
        }
        else if (integer.includes('-')) {
            if (integer === '-') {
                integer = '-0';
            }
            else {
                integer = '-' + parseInt(integer, 10) * -1; //To handle -0.123
            }
        }
        else {
            integer = parseInt(integer, 10) + '';
        }


        if (fraction.length > fractionSize) {
            const number = parseFloat('0.' + fraction);
            const exp = Math.pow(10, fractionSize);
            const rounded = Math.round(number * exp) / exp;
            if (rounded === 1) {
                integer = (parseInt(integer || '0', 10) + 1) + '';
                fraction = '';
            }
            else {
                fraction = (rounded + '').split('.')[1];
            }

        }
        return {integer: integer, fraction: fraction};
    }

    transform(value: number | string, fractionSize: number = 5): string {
        value = value + '';
        const re = /[\^¨~`´_:;!"#¤%&/()=@£$€{\[]/g
        value = value.replace(re, '');


        value = value.replace('.', this.DECIMAL_SEPARATOR);
        const [integerSplit, fractionSplit = ''] = value.split(this.DECIMAL_SEPARATOR);
        let {integer, fraction} = this.handleIntegerAndFractions(integerSplit, fractionSplit, fractionSize);
        if(integer === null){
            return null;
        }
        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);


        return integer + fraction;
    }



    parse(value: string, fractionSize: number = 5): string {
        value = value + '';
        const re = /[\^¨~`´_:;!"#¤%&/()=@£$€{\[]/g
        value = value.replace(re, '');
        value = value.replace('.', this.DECIMAL_SEPARATOR);
        let [integerSplit, fractionSplit = ''] = (value || '').split(this.DECIMAL_SEPARATOR);

        integerSplit = integerSplit.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');
        let {integer, fraction} = this.handleIntegerAndFractions(integerSplit, fractionSplit, fractionSize);

        fraction = fractionSize > 0
            ? '.' + (fraction + PADDING).substring(0, fractionSize)
            : '';

        if (!integer) {
            return '';
        }
        return integer + fraction;
    }

}

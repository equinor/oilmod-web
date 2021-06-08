import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'yesNo'})
export class YesNoPipe implements PipeTransform {
  transform(value: boolean, ignoreNulls = false): string {
    let valueStr = '';
    if (ignoreNulls) {
      valueStr = value ? 'Yes' : value === false ? 'No' : '';
    } else {
      valueStr = value ? 'Yes' : 'No';
    }
    return valueStr;

  }
}

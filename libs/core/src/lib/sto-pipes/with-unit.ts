import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getUnit'})
export class GetUnit implements PipeTransform {
  transform(value: string, withParens?: boolean): string {
    if (value) {
      const arr = value.split('(');
      if (arr.length > 0 ) {
        if (withParens) {
          value = '(' + arr[1];
        } else {
          arr[1].slice(0, -1);
          value = arr[1].slice(0, -1);
        }
      }
    }
    return value;
  }
}
@Pipe({name: 'excludeUnit'})
export class ExcludeUnit implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const arr = value.split('(');
      if (arr.length > 0) {
        value = arr[0];
      }
    }
    return value;
  }
}

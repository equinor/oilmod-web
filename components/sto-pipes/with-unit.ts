import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getUnit'})
export class GetUnit implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const arr = value.split('(');
      if (arr.length > 0) {
        value = '(' + arr[1];
      }
    }
    return value;
  }
}
@Pipe({name: 'excludeUnit'})
export class ExcludeUnit implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const arr = value.split('(');
      if (arr.length > 0) {
        value = arr[0];
      }
    }
    return value;
  }
}

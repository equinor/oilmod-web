import { Pipe, PipeTransform } from '@angular/core';
import { Column } from './columns';

@Pipe({
  name: 'exec'
})
export class ExecPipe<T = any> implements PipeTransform, Exec<T> {

  transform(func: Function | string, value?: any, column?: Column, row?: T): string {
    if ( func && typeof func === 'function' ) {
      return func(value, row, column);
    } else if ( typeof func === 'string' ) {
      return func;
    }
    return '';
  }

}

interface Exec<T = any> {
  transform(func: string): string;

  transform(func: Function | string, value: any, column: Column, row: T): string;

  transform(func: Function | string, value: T | Column): string;
}

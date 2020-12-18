import { Pipe, PipeTransform } from '@angular/core';
import { Column } from './columns';

@Pipe({
  name: 'exec'
})
export class ExecPipe<T = any, R = any> implements PipeTransform/*, Exec<T>*/ {

  transform(func: ( (...args) => R ) | R, value?: any, column?: Column, row?: T): R {
    if ( func && typeof func === 'function' ) {
      return ( func as (...args) => R )(value, row, column);
    } else if ( typeof func === 'string' ) {
      return func;
    }
    return '' as any;
  }

}

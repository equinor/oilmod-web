import { Pipe, PipeTransform } from '@angular/core';
import { Column } from './columns';

@Pipe({
  name: 'exec'
})
export class ExecPipe<T = unknown, R = any> implements PipeTransform/*, Exec<T>*/ {

  transform(func: ( (...args: unknown[]) => R ) | R, value?: unknown, column?: Column, row?: T): R | null {
    if ( func && typeof func === 'function' ) {
      return ( func as (...args: unknown[]) => R )(value, row, column);
    } else if ( typeof func === 'string' ) {
      return func;
    }
    return null;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exec'
})
export class ExecPipe implements PipeTransform, Exec {

  transform(value: any, func?: Function): any {
    if ( func && typeof func === 'function' ) {
      return func(value);
    }
    return value;
  }

}

interface Exec {
  transform(value: string): string;

  transform(value: any, func?: Function): string;
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms an Object to an Array.
 *
 * @example
 *
 * public obj = {a: 1, b: 2, c: 3};
 * <span *ngFor="let key of obj | keys "> {{ obj[key] }}, </span> -> 1, 2, 3,
 */

@Pipe({
  name: 'keys',
  standalone: true
})
export class KeysPipe implements PipeTransform {

  transform(value: Record<string, unknown>): Array<string> {
    if ( value ) {
      return Object.keys(value);
    }
    return [];
  }

}

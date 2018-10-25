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
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any): any[] {
    if (value) {
      return Object.keys(value);
    }
    return [];
  }

}

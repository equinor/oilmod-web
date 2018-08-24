import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tankState'
})
export class TankStatePipe implements PipeTransform {

  /**
   * tankState returns the requested key from a tank state, given that it exists.
   * @param tankId
   * @param tankStates
   * @param key
   * @param unit
   * {any}
   */
  transform(tankId: string, tankStates: any[], key: string, unit: 'operational'|'capacity' = 'operational'): any {
    if (!tankId || !tankStates || !key) {
      return null;
    }
    const tankState = tankStates
      .filter(x => !!(x))
      .find(t => t.tankId === tankId);
    if (tankState) {
      const keySplit = key.split('.');
      const section = keySplit[0];
      const value: Value = tankState[section];
      // To preserve backwards compability with old model, we check if we can access the unit binding
      // If the [unit] is null, 0 or anything else, we use it. Otherwise, we assume the old tank state model
      if (value && (value[unit] || value[unit] === 0 || value[unit] === null)) {
        return value[unit];
      } else {
        return value;
      }
    }
    console.error('Not Found');
    return null;
  }

}



export class Value {
  operational: number;
  capacity: number;
}

export class TankQuality {
  qualityId: string;
  stock: number;
}

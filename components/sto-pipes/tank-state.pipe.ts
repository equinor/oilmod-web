import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tankState'
})
export class TankStatePipe implements PipeTransform {

  transform(tankId: string, tankStates: TankState[], key: string): any {
    if (!tankId || !tankStates || !key) {
      return null;
    }
    const tankState = tankStates
      .filter(x => !!(x))
      .find(t => t.tankId === tankId);
    if (tankState) {
      return tankState[key];
    }
    console.error('Not Found');
    return null;
  }

}

export class TankState {
  tankId: string;
  tankName?: string;
  unit?: string;
  balance: number;
  statoilStock: number;
  ullage: number;
  qualityIds?: string[];
  tankQualities: TankQuality[];
}

export class TankQuality {
  qualityId: string;
  stock: number;
}
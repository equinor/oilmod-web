import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tankState'
})
export class TankStatePipe implements PipeTransform {

  transform(tankId: string, tankStates: TankState[], key: string): any {
    if (!tankId || !tankStates || !key) {
      console.error('Missing Input');
      return 'Error';
    }
    const tankState = tankStates.find(t => t.tankId === tankId);
    if (tankState) {
      return tankState[key];
    }
    console.error('Not Found');
    return 'Error';
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
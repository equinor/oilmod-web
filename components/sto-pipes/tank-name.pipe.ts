import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tankName'
})
export class TankNamePipe implements PipeTransform {

  transform(tankId: string, tanks: Tank[]): any {
    if (!tanks) {
      return 'No tankStates supplied';
    }
    if (!tankId) {
      return '';
    }
    const tank = tanks.find(t => t.id === tankId);
    if (tank) {
      return tank.name;
    }
    return 'Not Found';
  }

}

interface TankPeriod {
  id: string;
  version: number;
  updatedBy?: any;
  updatedDate?: any;
  fromDate: string;
  tankId: string;
  storageId: string;
  storageGroupId: string;
  heel: number;
  heated: boolean;
  overliftAllowed: boolean;
  minLevel: number;
  maxLevel: number;
  qualityCategory: string;
  description: string;
  qualityIds: string[];
}

interface Tank {
  id: string;
  version: number;
  updatedBy?: any;
  updatedDate?: any;
  establishedDate: string;
  terminatedDate: string;
  name: string;
  storageId: string;
  storageGroupId: string;
  tankPeriods: TankPeriod[];
}

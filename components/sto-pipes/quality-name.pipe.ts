import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qualityName'
})
export class QualityNamePipe implements PipeTransform {

  transform(qualityId: string, qualities: Quality[]): any {
    if (!qualities) {
      return 'No qualities passed in';
    }
    if (!qualityId) {
      return null;
    }
    const quality = qualities.find(q => q.id === qualityId);
    if (quality) {
      return quality.material;
    }
    return 'Not found';
  }

}



interface Quality {
  id: string;
  version: number;
  updatedBy: string;
  updatedDate: string;
  sapMaterialNo: string;
  material: string;
  product: string;
  lastUpdatedDate: string;
  baseUnitOfMeasure: string;
  inUse: boolean;
  defaultDensity?: number;
  sapDivisionId: string;
  sapDivisionName: string;
  qualityCategory: string;
}
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { FilterForm, FilterList } from '../../projects/stoui-common/src/lib/sto-filter/filter';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'filter-panel',
  template: `
      <sto-filter-panel [filterList]="filter$ | async"
                        class="sto-form"
                        [expandable]="true"
                        (toggled)="toggled()">
          <sto-filter-title>A Title!</sto-filter-title>
          <sto-filter-table-actions>
              <button mat-icon-button>
                  <mat-icon>add</mat-icon>
              </button>
          </sto-filter-table-actions>
          <div class="sto-form"
               [formGroup]="form"
               stoGrid>
              <mat-form-field floatLabel="always"
                              stoFormField
                              stoGridColumn>
                  <mat-label>Field 1</mat-label>
                  <input matInput
                         formControlName="field">
              </mat-form-field>
              <mat-form-field floatLabel="always"
                              stoFormField
                              stoGridColumn>
                  <mat-label>Field 2 (multi)</mat-label>
                  <mat-select [multiple]="true"
                              formControlName="otherField">
                      <mat-option [value]="1">{{1}}</mat-option>
                      <mat-option [value]="2">{{2}}</mat-option>
                      <mat-option [value]="3">{{3}}</mat-option>
                      <mat-option [value]="4">{{4}}</mat-option>
                  </mat-select>
              </mat-form-field>
              <div stoGridColumn
                   [stoGridColumnDouble]="true"
                   stoGridSpacer></div>
          </div>
      </sto-filter-panel>`
})
export class FilterPanelComponent extends FilterForm<{ field: string; otherField: number[] }> {
  formConfig = {
    field: [],
    otherField: []
  };
  serializer = map<{ field: string; otherField: number[] }, FilterList[]>((val) => {
    const f: FilterList[] = [];
    if ( val.field ) {
      f.push({ value: `Field1: ${val.field}`, key: 'field' });
    }
    if ( val.otherField && val.otherField.length ) {
      val.otherField
        .forEach((v, i) => f.push({ value: `Field2: ${v}`, key: 'otherField', index: i }));
      // f.push({value: `Field2: ${val.otherField.join(', ')}`, key: 'otherField'});
    }
    return f;
  });

  constructor(fb: FormBuilder) {
    super(fb);
  }
}

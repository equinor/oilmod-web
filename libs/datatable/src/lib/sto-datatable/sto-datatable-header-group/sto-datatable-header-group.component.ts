import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges, input } from '@angular/core';
import { Column, ColumnGroup } from '../columns';


@Component({
    selector: 'sto-datatable-header-group',
    templateUrl: './sto-datatable-header-group.component.html',
    styleUrls: ['./sto-datatable-header-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class StoDatatableHeaderGroupComponent implements OnChanges {
  readonly groups = input<ColumnGroup[]>();
  readonly height = input<number>();
  readonly width = input<string>();
  readonly transform = input<string>();

  readonly columns = input<Column[]>();

  testOffset(group: ColumnGroup) {
    const columns = this.columns();
    if ( !columns ) {
      return '';
    }
    const { columnStart } = group;
    const slice = columns.slice(0, columnStart);
    let transform = 0;
    slice.forEach(col => transform = transform + ( col.flexBasis || 80 ));
    return `translateX(${transform + 8}px)`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes.groups || changes.columns ) {
      const groups: ColumnGroup[] = changes.groups ? changes.groups.currentValue : this.groups();
      const columns = changes.columns ? changes.columns.currentValue : this.columns();
      if ( groups && columns ) {
        groups.forEach(group => {
          group.transform = this.testOffset(group);
        });
      }
    }
  }
}

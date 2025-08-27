import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Column, ColumnGroup } from '../columns';


@Component({
    selector: 'sto-datatable-header-group',
    templateUrl: './sto-datatable-header-group.component.html',
    styleUrls: ['./sto-datatable-header-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class StoDatatableHeaderGroupComponent implements OnChanges {
  @Input()
  groups: ColumnGroup[];
  @Input()
  height: number;
  @Input()
  width: string;
  @Input()
  transform: string;

  @Input() columns: Column[];

  testOffset(group: ColumnGroup) {
    if ( !this.columns ) {
      return '';
    }
    const { columnStart } = group;
    const slice = this.columns.slice(0, columnStart);
    let transform = 0;
    slice.forEach(col => transform = transform + ( col.flexBasis || 80 ));
    return `translateX(${transform + 8}px)`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes.groups || changes.columns ) {
      const groups: ColumnGroup[] = changes.groups ? changes.groups.currentValue : this.groups;
      const columns = changes.columns ? changes.columns.currentValue : this.columns;
      if ( groups && columns ) {
        groups.forEach(group => {
          group.transform = this.testOffset(group);
        });
      }
    }
  }
}

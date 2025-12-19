import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Column, ColumnGroup } from '../columns';

interface GroupWithTransform extends ColumnGroup {
  transform: string;
}

@Component({
  selector: 'sto-datatable-header-group',
  templateUrl: './sto-datatable-header-group.component.html',
  styleUrl: './sto-datatable-header-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class StoDatatableHeaderGroupComponent {
  readonly groups = input<ColumnGroup[]>();
  readonly height = input<number>();
  readonly width = input<string>();
  readonly transform = input<string>();
  readonly columns = input<Column[]>();

  // Computed signal that reactively calculates group transforms
  readonly groupsWithTransforms = computed<GroupWithTransform[]>(() => {
    const groups = this.groups();
    const columns = this.columns();

    if (!groups || !columns) {
      return [];
    }

    return groups.map((group) => ({
      ...group,
      transform: this.calculateGroupOffset(group, columns),
    }));
  });

  private calculateGroupOffset(group: ColumnGroup, columns: Column[]): string {
    const { columnStart } = group;
    const precedingColumns = columns.slice(0, columnStart);

    const offset = precedingColumns.reduce(
      (total, col) => total + (col.flexBasis || 80),
      0,
    );

    return `translateX(${offset + 8}px)`;
  }
}

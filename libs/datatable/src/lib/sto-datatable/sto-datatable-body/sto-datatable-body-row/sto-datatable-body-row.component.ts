import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  KeyValueDiffer,
  KeyValueDiffers,
  TemplateRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { ColumnStylePipe } from '../../column-style.pipe';
import { Column, ColumnDisplay } from '../../columns';
import { ExecPipe } from '../../exec.pipe';
import { rowClassFn } from '../../models';

@Component({
  selector: 'sto-datatable-body-row',
  templateUrl: './sto-datatable-body-row.component.html',
  styleUrls: ['./sto-datatable-body-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cssClassStr()',
  },
  imports: [NgTemplateOutlet, NgClass, NgStyle, ExecPipe, ColumnStylePipe],
})
export class StoDatatableBodyRowComponent<T extends object> implements DoCheck {
  private differs = inject(KeyValueDiffers);
  private cdr = inject(ChangeDetectorRef);
  private elRef = inject(ElementRef);

  readonly responsiveView = input<TemplateRef<unknown>>();
  readonly row = input<T>();
  readonly columns = input<Column[]>();
  readonly compressedView = input<boolean>();
  readonly rowIndex = input<number>(0);
  readonly isSelected = input<boolean>();
  readonly rowClass = input<rowClassFn>();
  readonly cssClassStr = computed(() => {
    const rowClassFn = this.rowClass();
    const cls = [
      'datatable-body-row',
      'sto-mdl-table__body__row',
      ...(this.isSelected() ? ['sto-mdl-table__body__row--selected'] : []),
      ...(this.compressedView()
        ? ['sto-mdl-table__body__row--compressed']
        : []),
    ];
    if (rowClassFn) {
      if (typeof rowClassFn === 'function') {
        cls.push(rowClassFn(this.row()));
      } else if (typeof rowClassFn === 'object' && !!rowClassFn) {
        cls.push(Object.values(rowClassFn).join(' '));
      } else if (typeof rowClassFn === 'string') {
        cls.push(rowClassFn);
      }
    }
    return cls.join(' ');
  });
  readonly rowContextMenu = output<{
    event: MouseEvent | KeyboardEvent;
    column: Column;
    row: T;
    index: number;
  }>();
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);

  public element: HTMLDivElement;

  private rowDiffer: KeyValueDiffer<string, unknown>;
  public trackColumn = (index: number, column: Column) => {
    return column.$$id ?? column.prop;
  };

  constructor() {
    const differs = this.differs;

    this.rowDiffer = differs.find({}).create<string, unknown>();
    this.element = this.elRef.nativeElement as HTMLDivElement;
  }

  ngDoCheck() {
    const r = this.row();
    // Cast to an indexable record for differ purposes only.
    if (r != null && this.rowDiffer.diff(r as Record<string, unknown>)) {
      this.cdr.detectChanges();
    }
  }

  // Helper to safely get a value for dynamic column.prop access without requiring T to be indexable
  public cellValue(row: T | undefined, prop: string): unknown {
    if (!row) return undefined;
    // Access through intermediate unknown then indexable record to avoid lint 'any'
    const rec = row as unknown as Record<string, unknown>;
    return rec[prop];
  }
}

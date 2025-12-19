import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  TemplateRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { StoRowWidthHelper } from '../../../sto-row-width.helper';
import { ColumnStylePipe } from '../../column-style.pipe';
import { Column, ColumnDisplay } from '../../columns';
import { ExecPipe } from '../../exec.pipe';
import { rowClassFn } from '../../models';

@Component({
  selector: 'sto-datatable-body-row',
  templateUrl: './sto-datatable-body-row.component.html',
  styleUrl: './sto-datatable-body-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cssClassStr()',
  },
  imports: [NgTemplateOutlet, NgClass, NgStyle, ExecPipe, ColumnStylePipe],
})
export class StoDatatableBodyRowComponent<T extends object> {
  private readonly elRef = inject(ElementRef<HTMLDivElement>);
  private readonly rowWidthHelper = inject(StoRowWidthHelper);
  private readonly injector = inject(Injector);
  private cellValueCache = new WeakMap<T, Map<string, unknown>>();

  readonly responsiveView = input<TemplateRef<unknown>>();
  readonly row = input<T>();
  readonly columns = input<Column[]>();
  readonly compressedView = input<boolean>();
  readonly rowIndex = input<number>(0);
  readonly isSelected = input<boolean>();
  readonly rowClass = input<rowClassFn>();
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);

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

  constructor() {
    // Only run width calculation once for the first row, avoid running for every row instance
    afterNextRender(
      () => {
        if (
          this.rowWidthHelper.currentRowWidth() === 0 &&
          this.rowIndex() === 0
        ) {
          const el = this.elRef.nativeElement;
          this.rowWidthHelper.currentRowWidth.set(
            el.getBoundingClientRect().width,
          );
        }
      },
      { injector: this.injector },
    );
  }

  readonly rowContextMenu = output<{
    event: MouseEvent | KeyboardEvent;
    column: Column;
    row: T;
    index: number;
  }>();

  readonly element = this.elRef.nativeElement;

  readonly trackColumn = (_index: number, column: Column) =>
    column.$$id ?? column.prop;

  // Helper to safely get a value for dynamic column.prop access with memoization
  readonly cellValue = (row: T | undefined, prop: string): unknown => {
    if (!row) return undefined;

    let propCache = this.cellValueCache.get(row);
    if (!propCache) {
      propCache = new Map<string, unknown>();
      this.cellValueCache.set(row, propCache);
    }

    if (!propCache.has(prop)) {
      propCache.set(prop, (row as Record<string, unknown>)[prop]);
    }

    return propCache.get(prop);
  };
}

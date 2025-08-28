import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  KeyValueDiffer,
  KeyValueDiffers,
  TemplateRef,
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
    class: 'datatable-body-row',
  },
  imports: [NgTemplateOutlet, NgClass, NgStyle, ExecPipe, ColumnStylePipe],
})
export class StoDatatableBodyRowComponent<T extends Record<string, unknown>>
  implements DoCheck
{
  private differs = inject(KeyValueDiffers);
  private cdr = inject(ChangeDetectorRef);
  private elRef = inject(ElementRef);

  readonly responsiveView = input<TemplateRef<unknown>>();
  readonly row = input<T>({} as T);
  readonly columns = input<Column[]>();
  readonly compressedView = input<boolean>();
  readonly rowIndex = input<number>(0);
  readonly rowClass = input<rowClassFn>();
  readonly isSelected = input<boolean>();
  readonly rowContextMenu = output<{
    event: MouseEvent | KeyboardEvent;
    column: Column;
    row: T;
    index: number;
  }>();
  readonly columnMode = input<ColumnDisplay>(ColumnDisplay.Flex);

  public element: HTMLDivElement;

  @HostBinding('class')
  get cssClass() {
    let cls = 'sto-mdl-table__body__row';
    if (this.isSelected()) {
      cls += ' sto-mdl-table__body__row--selected';
    }

    const rowClass = this.rowClass();
    if (rowClass) {
      let userClass = ' ';
      if (typeof rowClass === 'function') {
        userClass += rowClass(this.row());
      } else if (typeof rowClass === 'object' && !!rowClass) {
        userClass += Object.values(rowClass).join(' ');
      } else if (typeof rowClass === 'string') {
        userClass += rowClass;
      }
      cls += userClass;
    }

    if (this.compressedView()) {
      cls += ' sto-mdl-table__body__row--compressed';
    }

    return cls;
  }

  private rowDiffer: KeyValueDiffer<unknown, unknown>;
  public trackColumn = (index: number, column: Column) => {
    return column.$$id ?? column.prop;
  };

  constructor() {
    const differs = this.differs;

    this.rowDiffer = differs.find({}).create();
    this.element = this.elRef.nativeElement as HTMLDivElement;
  }

  ngDoCheck() {
    if (this.rowDiffer.diff(this.row())) {
      this.cdr.detectChanges();
    }
  }
}

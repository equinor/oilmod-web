import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  TemplateRef,
} from '@angular/core';
import { Column, ColumnDisplay } from '../../columns';
import { rowClassFn } from '../../models';

@Component({
  selector: 'sto-datatable-body-row',
  templateUrl: './sto-datatable-body-row.component.html',
  styleUrls: ['./sto-datatable-body-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'datatable-body-row',
  },
})
export class StoDatatableBodyRowComponent<T extends Record<string, unknown>>
  implements DoCheck
{
  @Input()
  responsiveView: TemplateRef<unknown>;
  @Input()
  row: T;
  @Input()
  columns: Column[];
  @Input()
  compressedView: boolean;
  @Input()
  rowIndex: number;
  @Input()
  rowClass: rowClassFn;
  @Input()
  isSelected: boolean;
  @Output()
  rowContextMenu = new EventEmitter();
  @Input()
  columnMode: ColumnDisplay;

  public element: HTMLDivElement;

  @HostBinding('class')
  get cssClass() {
    let cls = 'sto-mdl-table__body__row';
    if (this.isSelected) {
      cls += ' sto-mdl-table__body__row--selected';
    }

    if (this.rowClass) {
      let userClass = ' ';
      if (typeof this.rowClass === 'function') {
        userClass += this.rowClass(this.row);
      } else if (typeof this.rowClass === 'object' && !!this.rowClass) {
        userClass += Object.values(this.rowClass).join(' ');
      } else if (typeof this.rowClass === 'string') {
        userClass += this.rowClass;
      }
      cls += userClass;
    }

    if (this.compressedView) {
      cls += ' sto-mdl-table__body__row--compressed';
    }

    return cls;
  }

  private rowDiffer: KeyValueDiffer<unknown, unknown>;
  public trackColumn = (index: number, column: Column) => {
    return column.$$id ?? column.prop;
  };

  constructor(
    private differs: KeyValueDiffers,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef
  ) {
    this.rowDiffer = differs.find({}).create();
    this.element = this.elRef.nativeElement as HTMLDivElement;
  }

  ngDoCheck() {
    if (this.rowDiffer.diff(this.row)) {
      this.cdr.detectChanges();
    }
  }
}

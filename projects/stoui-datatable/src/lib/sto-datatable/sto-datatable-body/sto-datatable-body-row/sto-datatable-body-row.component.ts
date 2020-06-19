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
  TemplateRef
} from '@angular/core';
import { Column, ColumnDisplay } from '../../columns';
import { RowContextMenu } from '../../events';

@Component({
  selector: 'sto-datatable-body-row',
  templateUrl: './sto-datatable-body-row.component.html',
  styleUrls: ['./sto-datatable-body-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoDatatableBodyRowComponent<T = any> implements DoCheck {
  @Input()
  responsiveView: TemplateRef<any>;
  @Input()
  row: any;
  @Input()
  columns: Column[];
  @Input()
  compressedView: boolean;
  @Input()
  rowIndex: number;
  @Input()
  rowClass: any;
  @Input()
  isSelected: boolean;
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Input()
  columnMode: ColumnDisplay;

  public element: HTMLDivElement;


  @HostBinding('class')
  get cssClass() {
    let cls = 'sto-mdl-table__body__row';
    if ( this.isSelected ) {
      cls += ' sto-mdl-table__body__row--selected';
    }

    if ( this.rowClass ) {
      let userClass = ' ';
      if ( typeof this.rowClass === 'function' ) {
        userClass += this.rowClass(this.row);
      } else if ( typeof this.rowClass === 'object' && !!this.rowClass ) {
        userClass += Object.values(this.rowClass).join(' ');
      } else if ( typeof this.rowClass === 'string' ) {
        userClass += this.rowClass;
      }
      cls += userClass;
    }

    if ( this.compressedView ) {
      cls += ' sto-mdl-table__body__row--compressed';
    }

    return cls;
  }

  private rowDiffer: KeyValueDiffer<{}, {}>;

  constructor(private differs: KeyValueDiffers, private cdr: ChangeDetectorRef, private elRef: ElementRef) {
    this.rowDiffer = differs.find({}).create();
    this.element = this.elRef.nativeElement as HTMLDivElement;
  }

  ngDoCheck() {
    if ( this.rowDiffer.diff(this.row) ) {
      this.cdr.detectChanges();
    }
  }

}

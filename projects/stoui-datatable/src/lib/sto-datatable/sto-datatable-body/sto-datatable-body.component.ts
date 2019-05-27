import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { RowActivation, RowContextMenu, RowSelection } from '../events';
import { Column } from '../columns';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Key } from '@ngx-stoui/core';
import { SelectionModes } from '../selection-modes';

@Component({
  selector: 'sto-datatable-body',
  templateUrl: './sto-datatable-body.component.html',
  styleUrls: [ './sto-datatable-body.component.scss' ]
})
export class StoDatatableBodyComponent<T = any> implements OnDestroy {
  @Input()
  responsive: boolean;
  @Input()
  smallView: boolean;
  @Input()
  responsiveView: TemplateRef<any>;
  @Input()
  height: number;
  @Input()
  rows: T[];
  @Input()
  selectable: boolean;
  @Input()
  rowHeight: number;
  @Input()
  selected: T;
  @Input()
  columns: Column[];
  @Input()
  virtualScroll: boolean;
  @Input()
  rowClass: Function;
  @Input()
  selectionMode: SelectionModes;
  @Output()
  rowSelected = new EventEmitter<RowSelection<T>>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  activate = new EventEmitter<RowActivation<T>>();
  @ViewChild(CdkVirtualScrollViewport)
  scroller: CdkVirtualScrollViewport;

  private destroyed$ = new Subject<boolean>();
  private rowDiffer: KeyValueDiffer<T, T>;
  private timeout;

  @HostListener('window:resize', [ '$event' ])
  onresize(event) {
    if ( !this.scroller ) {
      return;
    }
    if ( this.timeout ) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.scroller.ngOnInit();
    }, 100);
  }

  @Input()
  trackBy = (item: T, index: number) => {
    return index;
  };
  _rowClass = (row: T) => {
    let userDefinedClass = '';
    if ( this.rowClass ) {
      userDefinedClass = this.rowClass.bind(this)(row);
    }
    return `${userDefinedClass} sto-mdl-table__body__row`;
  };

  constructor(private differs: KeyValueDiffers,) {
    this.rowDiffer = differs.find({}).create();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  selectRow(event: KeyboardEvent | MouseEvent, activationData: RowSelection<T>) {
    if ( event.type === this.selectionMode ) {
      this.rowSelected.emit(activationData);
      const el = event.target as HTMLElement;
      const ignoreRe = /.*mat-select.*|.*mat-option.*|.*mat-input.*|.*mat-form.*/i;
      const elTag = el.tagName.toLowerCase();
      const isIgnoredEl = ignoreRe.test(el.className) || elTag === 'input';
      if ( !isIgnoredEl ) {
        activationData.rowEl.focus();
      }
    }
  }

  onKeyDownHandler(event: KeyboardEvent, rowEl: HTMLDivElement, activationData: RowSelection<T>) {
    this.activate.emit({ event, rowEl, row: activationData.row, index: activationData.index });
    const next = rowEl.nextSibling as HTMLDivElement;
    const prev = rowEl.previousSibling as HTMLDivElement;
    switch ( event.keyCode ) {
      case Key.DownArrow:
        if ( next && next instanceof HTMLElement ) {
          next.focus();
          event.preventDefault();
        }
        break;
      case Key.UpArrow:
        if ( prev && prev instanceof HTMLElement ) {
          prev.focus();
          event.preventDefault();
        }
        break;
      case Key.Enter:
        this.rowSelected.emit(activationData);
        break;
    }
  }

}

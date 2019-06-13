import {
  Component,
  ElementRef,
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

declare var ResizeObserver: any;

@Component({
  selector: 'sto-datatable-body',
  templateUrl: './sto-datatable-body.component.html',
  styleUrls: [ './sto-datatable-body.component.scss' ]
})
export class StoDatatableBodyComponent<T = any> implements OnDestroy {
  @ViewChild('scrollViewport', { read: ElementRef })
  scrollElement: ElementRef<HTMLElement>;
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
  scrollbarH: boolean;
  @Input()
  rowClass: Function;
  @Input()
  selectionMode: SelectionModes;
  @Input()
  hasFooter: boolean;
  @Output()
  rowSelected = new EventEmitter<RowSelection<T>>();
  @Output()
  rowContextMenu = new EventEmitter<RowContextMenu<T>>();
  @Output()
  activate = new EventEmitter<RowActivation<T>>();
  @Output()
  scrollHeader = new EventEmitter<any>();
  @ViewChild(CdkVirtualScrollViewport)
  scroller: CdkVirtualScrollViewport;

  get width() {
    if ( this.scrollbarH ) {
      const width = this.columns.map(col => col.flexBasis || 80).reduce((a, b) => a + b, 0);
      return `${width}px`;
    }
    return 'auto';
  }

  private destroyed$ = new Subject<boolean>();
  private rowDiffer: KeyValueDiffer<T, T>;
  private timeout;
  private resizeObserver: any;
  public horizontalScrollActive: boolean;
  public verticalScrollOffset: number = 0;

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

  constructor(private differs: KeyValueDiffers) {
    this.rowDiffer = differs.find({}).create();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.resizeObserver.disconnect();
  }

  ngAfterViewInit() {
    const elRef = this.scroller.elementRef.nativeElement;
    const cb = (entries) => {
      if ( !this.hasFooter ) {
        return;
      }
      for ( const entry of entries ) {
        const t = entry.target as HTMLElement;
        const el = t.querySelector('.cdk-virtual-scroll-spacer') as HTMLDivElement;
        const currentScale = el.style.transform;
        const notScaled = this.rows.length * this.rowHeight;
        this.verticalScrollOffset = t.scrollHeight > t.offsetHeight ? 14 : 0;
        if ( t.scrollWidth > t.offsetWidth ) {
          this.horizontalScrollActive = true;
          const strScale = /\d+/.exec(currentScale || '');
          if ( !strScale ) {
            return;
          }
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale === notScaled ) {
            const newScaleValue = notScaled + this.rowHeight;
            el.style.transform = `scaleY(${newScaleValue}`;
          }
        } else {
          this.horizontalScrollActive = false;
          const strScale = /\d+/.exec(currentScale || '');
          const numericScale = Number(strScale[ 0 ]);
          if ( numericScale !== notScaled ) {
            el.style.transform = `scaleY(${notScaled}`;
          }
        }
      }
    };
    this.resizeObserver = new ResizeObserver(cb).observe(elRef);
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

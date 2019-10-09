import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from '../columns';
import { HeaderContextMenu } from '../events';
import { animate, state, style, transition, trigger, } from '@angular/animations';

@Component({
  selector: 'sto-datatable-header',
  templateUrl: './sto-datatable-header.component.html',
  styleUrls: [ './sto-datatable-header.component.scss' ],
  animations: [
    trigger('sort', [
      state('open', style({ width: '16px', opacity: 1 })),
      transition('void => *', [
        style({ width: 0, overflow: 'hidden', opacity: 0 }),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({ width: 0, overflow: 'hidden', opacity: 0 }))
      ])
    ])
  ]
})
export class StoDatatableHeaderComponent<T = any> implements OnInit {
  @Input()
  responsive: boolean;
  @Input()
  smallScreen: boolean;
  @Input()
  headerHeight: number;
  @Input()
  width: string;
  @Input()
  scrollLeft: string;
  @Input()
  bodyHeight: number;
  @Input()
  rows: T[];
  @Input()
  rowHeight: number;
  @Input()
  columns: Column[];
  @Input()
  sortable: boolean;
  @Input()
  activeSortId: string;
  public sortDirection: 'asc' | 'desc' | null;


  @Output()
  headerContextMenu = new EventEmitter<HeaderContextMenu>();
  @Output()
  sort = new EventEmitter<{ column: Column, sortDir: 'asc' | 'desc' | null }>();

  constructor() {
  }

  ngOnInit() {
  }

  public trackColumnsFn(index: number, item: Column) {
    return item.$$id;
  }

  sortByColumn(column: Column) {
    if ( !this.sortable || column.disableSort ) {
      return;
    }
    if ( column.$$id === this.activeSortId && this.sortDirection === 'desc' ) {
      this.sortDirection = null;
    } else if ( column.$$id === this.activeSortId && this.sortDirection === 'asc' ) {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sort.emit({ column, sortDir: this.sortDirection });
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  KeyValueDiffers,
  QueryList,
  ViewEncapsulation,
  ViewChild,
  HostBinding, Output, EventEmitter
} from '@angular/core';

import { translateTemplates } from '../../../vendor/ngx-datatable/utils';
import { ColumnGroup } from '../types/column-header.type';
import { StoDataTableColumnGroupDirective } from './columns/sto-column-title.directive';
import { DatatableComponent } from '../../../vendor/ngx-datatable/components/datatable.component';
import { ScrollbarHelper } from '../../../vendor/ngx-datatable/services/scrollbar-helper.service';
import { columnTotalWidth } from '../../../vendor/ngx-datatable/utils/column';
import { StoDataTableBodyComponent } from './body/sto-body.component'
import { DataTableColumnDirective } from '../../../vendor/ngx-datatable/components/columns/column.directive';
import { setColumnDefaults } from '../../../vendor/ngx-datatable/utils/column-helper';
import { TableColumn } from '../../../vendor/ngx-datatable/types/table-column.type';

@Component({
  selector: 'sto-complex-datatable',
  template: `
	  <div
			  visibilityObserver
			  (visible)="recalculate()">
		  <sto-complex-header
				  *ngIf="headerHeight"
				  [sorts]="sorts"
				  [sortType]="sortType"
				  [scrollbarH]="scrollbarH"
				  [innerWidth]="innerWidth"
				  [offsetX]="offsetX"
				  [dealsWithGroup]="groupedRows"
				  [columns]="_internalColumns"
				  [columnGroups]="_internalColumnGroups"
				  [headerHeight]="headerHeight"
				  [reorderable]="reorderable"
				  [sortAscendingIcon]="cssClasses.sortAscending"
				  [sortDescendingIcon]="cssClasses.sortDescending"
				  [allRowsSelected]="allRowsSelected"
				  [selectionType]="selectionType"
				  (sort)="onColumnSort($event)"
				  (resize)="onColumnResize($event)"
				  (reorder)="onColumnReorder($event)"
				  (select)="onHeaderSelect($event)"
				  (columnContextmenu)="onColumnContextmenu($event)">
		  </sto-complex-header>
		  <sto-complex-body
				  [groupRowsBy]="groupRowsBy"
				  [groupedRows]="groupedRows"
          [selectByDoubleClick]="selectByDoubleClick"
				  [rows]="_internalRows"
				  [groupExpansionDefault]="groupExpansionDefault"
				  [scrollbarV]="scrollbarV"
				  [scrollbarH]="scrollbarH"
				  [loadingIndicator]="loadingIndicator"
				  [externalPaging]="externalPaging"
				  [rowHeight]="rowHeight"
				  [rowCount]="rowCount"
				  [offset]="offset"
				  [trackByProp]="trackByProp"
				  [columns]="_internalColumns"
				  [pageSize]="pageSize"
				  [offsetX]="offsetX"
				  [rowDetail]="rowDetail"
				  [groupHeader]="groupHeader"
				  [selected]="selected"
				  [innerWidth]="innerWidth"
				  [bodyHeight]="bodyHeight"
				  [selectionType]="selectionType"
				  [emptyMessage]="messages.emptyMessage"
				  [rowIdentity]="rowIdentity"
				  [rowClass]="rowClass"
				  [selectCheck]="selectCheck"
				  (page)="onBodyPage($event)"
				  (activate)="activate.emit($event)"
          [canMoveRows]="canMoveRows"
          [moveRowsCheck]="moveRowsCheck"
				  (rowContextmenu)="onRowContextmenu($event)"
				  (select)="onBodySelect($event)"
				  (scroll)="onBodyScroll($event)"
          (moveRow)="moveRow.emit($event)"
          [moveRowMapper]="moveRowMapper"
				  [summaryRowData]="_internalSummaryRowData"
				  [summaryColumns]="_internalSummaryColumns"
          [fixedFooter]="fixedFooter"
		  >
		  </sto-complex-body> 
		  <datatable-footer
				  *ngIf="footerHeight"
				  [rowCount]="rowCount"
				  [pageSize]="pageSize"
				  [offset]="offset"
				  [footerHeight]="footerHeight"
				  [footerTemplate]="footer"
				  [totalMessage]="messages.totalMessage"
				  [pagerLeftArrowIcon]="cssClasses.pagerLeftArrow"
				  [pagerRightArrowIcon]="cssClasses.pagerRightArrow"
				  [pagerPreviousIcon]="cssClasses.pagerPrevious"
				  [selectedCount]="selected.length"
				  [selectedMessage]="!!selectionType && messages.selectedMessage"
				  [pagerNextIcon]="cssClasses.pagerNext"
				  (page)="onFooterPage($event)">
		  </datatable-footer>
	  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../vendor/ngx-datatable/components/datatable.component.scss'],
  host: {
    class: 'ngx-datatable'
  }
})
export class StoComplexDatatableComponent extends DatatableComponent {
  _columnGroupTemplates : QueryList<StoDataTableColumnGroupDirective>;
  _internalSummaryColumns: ColumnGroup[];
  _internalSummaryRowData: any;
  _internalColumnGroups: ColumnGroup[];
  _columnGroups: ColumnGroup[];

  @ViewChild(StoDataTableBodyComponent) bodyComponent: StoDataTableBodyComponent;
  @Input() canMoveRows: boolean;
  @Input() moveRowsCheck: Function;
  @Input() moveRowMapper: Function;
  @Output() moveRow = new EventEmitter();
  @Input() selectByDoubleClick: boolean;
  @Input() fixedFooter: boolean;
  private _height: number;
    @Input() set height(value){

    if(value === undefined){
      return;
    }
    this._height = parseInt(value, 10);
    if (this.scrollbarV) {
      let height = parseInt(value, 10);
      if (this.headerHeight) {
        height = height - this.headerHeight;
      }
      if (this.footerHeight) {
        height = height - this.footerHeight;
      }
      this.bodyHeight = height;
    }

    this.recalculatePages();

  };
  private previousLength: number;


  @ContentChildren(DataTableColumnDirective)
  set columnTemplates(val: QueryList<DataTableColumnDirective>) {
    if (val) {
      // only set this if results were brought back
      const arr = val.toArray();
      if (arr.length && arr.length !== this.previousLength) {
        // translate them to normal objects
        this._internalColumns = translateTemplates(arr);
        setColumnDefaults(this._internalColumns);
        this.recalculateColumns();
      }
      this._columnTemplates = val;
      this.previousLength = arr.length;
    }
  }
  /**
   * Columns to be displayed.
   */
  @Input() set columns(val: TableColumn[]) {

    if (val) {
      this._internalColumns = [...val];
      setColumnDefaults(this._internalColumns);
      this.recalculateColumns();
      this.resizeColumnGroups();
      if (this._internalSummaryColumns) {
        this.linkColumns(this._internalSummaryColumns, this._internalColumns);
      }
    }

    this._columns = val;
  }

  /**
   * Get the columns.
   */
  get columns(): TableColumn[] {
    return this._columns;
  }



  //data-bind to the host element's style property
  @HostBinding('style.backgroundColor') color = 'white';//default color

  @Input() set summaryRow(val: any) {

    if (val) {
      const data = Object.assign({}, val.data);
      if (data.summaryText) {
        delete data.summaryText;
      }
      if(this.fixedFooter){
        const fields = Object.keys(data);
        fields.forEach(f => {
          this.rows
          // .filter(row => row.hasOwnProperty(f))
            .filter(row => this.nestedValue(f, row))
            .forEach(row => {
              val.data[f] += this.nestedValue(f, row);
            });
        });
      }

      this.linkColumns(val.columns, this._internalColumns);
      this._internalSummaryColumns = val.columns;
      this._internalSummaryRowData = val.data;
    }
  }

  private linkColumns(summaryColumns: any[], columns: any) {
    for (let ii = 0; ii < summaryColumns.length; ii++) {
      let summaryColumn = summaryColumns[ii];
      if (columns) {
        if (summaryColumn.props) {
          summaryColumn.columns = columns.filter(column => summaryColumn.props.indexOf(column.prop) > -1);
        }
        else {
          summaryColumn.columns = columns.filter(column => summaryColumn.prop === column.prop);
        }
      }
    }
    this.setSummaryRowCellWidth(summaryColumns);
  }

  private nestedValue(location: string, object: Object): number|null {
    if (object instanceof Object) {
      const keys = location.split('.'); // Split object keys by .
      let val: number | Object = Object.assign({}, object);
      let i = 0;
      while (i < keys.length && !!val) {
        const key = keys[i];
        val = val[key];
        i++;
      }
      return typeof val === 'number' ? parseFloat(val.toFixed(10)) : 0;
    }
    return null;
  }

  private setSummaryRowCellWidth(summaryColumns: any[]) {
    summaryColumns.forEach(
      columnGroup => {
        columnGroup.width = columnTotalWidth(columnGroup.columns);
      }
    );
  }




  @ContentChildren(StoDataTableColumnGroupDirective)
  set columnGroupTemplates(val: QueryList<StoDataTableColumnGroupDirective>) {
    this._columnGroupTemplates = val;

    if (val) {
      // only set this if results were brought back
      const arr = val.toArray();
      if (arr.length) {
        // translate them to normal objects
        this._internalColumnGroups = translateTemplates(arr);

      }
    }
  }

  recalculate(): void {

    this.recalculateDims();
    this.recalculateColumns();
    this.resizeColumnGroups();
    if (this._internalSummaryColumns) {
      this.linkColumns(this._internalSummaryColumns, this._internalColumns);
    }

}

  recalculateDims(): void {
    const dims = this.element.getBoundingClientRect();
    this.innerWidth = Math.floor(dims.width);

    if (this.scrollbarV) {
      let height = dims.height;
      if(this._height){
        height = this._height;
      }
      if (this.headerHeight) {
        height = height - this.headerHeight;
      }
      if (this.footerHeight) {
        height = height - this.footerHeight;
      }
      this.bodyHeight = height;
    }

    this.recalculatePages();
  }

  onColumnResize({column, newValue}: any): void {
    super.onColumnResize({column, newValue});
    this.resizeSummaryColumns(column, newValue);
    this.resizeColumnGroups();
  }

  private resizeColumnGroups() {
    if (!this._internalColumnGroups) {
      return;
    }
    this._internalColumnGroups = this._internalColumnGroups.map(c => c);
  }

  private resizeSummaryColumns(column: any, newValue: any) {
    if(!this._internalSummaryColumns){
      return;
    }
    const cols = this._internalSummaryColumns.map((c, i) => {
      c = {...c};

      if (c.$$id === column.$$id) {
        c.width = newValue;

        // set this so we can force the column
        // width distribution to be to this value
        c.$$oldWidth = newValue;
      }

      return c;
    });
    this.linkColumns(cols, this._internalColumns);

    this._internalSummaryColumns = cols;
  }

  /**
   * Returns the column templates.
   */
  get columnGroupTemplates(): QueryList<StoDataTableColumnGroupDirective> {
    return this._columnGroupTemplates;
  }

  constructor(scrollbarHelper: ScrollbarHelper,
              cd: ChangeDetectorRef,
              element: ElementRef,
              differs: KeyValueDiffers) {
    super(scrollbarHelper, cd, element, differs);
  }

}

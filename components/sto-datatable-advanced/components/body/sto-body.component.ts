import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { translateXY } from '../../../../vendor/ngx-datatable/utils';
import { DataTableBodyComponent } from '../../../../vendor/ngx-datatable/components/body/body.component';
import { TableColumn } from '../../../../vendor/ngx-datatable/types/table-column.type';
import { setColumnDefaults } from '../../../../vendor/ngx-datatable/utils/column-helper';
import { StoScrollerComponent } from './sto-scroller.component';

@Component({
  selector: 'sto-complex-body',
  template: `
	  <sto-datatable-selection
			  #selector
			  [selected]="selected"
        [selectByDoubleClick]="selectByDoubleClick"
			  [rows]="temp"
			  [selectCheck]="selectCheck"
			  [selectEnabled]="selectEnabled"
			  [selectionType]="selectionType"
			  [rowIdentity]="rowIdentity"
    		[canMoveRows]="canMoveRows"
        (moveRow)="onMoveRow($event)"
    		(select)="select.emit($event)"
			  (activate)="activate.emit($event)">
		  <datatable-progress
				  *ngIf="loadingIndicator">
		  </datatable-progress>
		  <sto-datatable-scroller
				  *ngIf="rows?.length"
				  [scrollbarV]="scrollbarV"
				  [scrollbarH]="scrollbarH"
				  [scrollHeight]="scrollHeight"
				  [scrollWidth]="columnGroupWidths.total"
				  (scroll)="onBodyScroll($event)"
          [offset]="36"
      >
			  <datatable-row-wrapper
					  [groupedRows]="groupedRows"
					  *ngFor="let group of temp; let i = index; trackBy: rowTrackingFn;"
					  [innerWidth]="innerWidth"
					  [ngStyle]="getRowsStyles(group)"
					  [rowDetail]="rowDetail"
					  [groupHeader]="groupHeader"
					  [offsetX]="offsetX"
					  [detailRowHeight]="getDetailRowHeight(group[i],i)"
					  [row]="group"
					  [expanded]="getRowExpanded(group)"
					  [rowIndex]="getRowIndex(group[i])"
					  (rowContextmenu)="rowContextmenu.emit($event)">
				  <sto-datatable-body-row
						  *ngIf="!groupedRows; else groupedRowsTemplate"
						  tabindex="-1"
						  [isSelected]="selector.getRowSelected(group)"
						  [innerWidth]="innerWidth"
						  [offsetX]="offsetX"
						  [columns]="columns"
						  [rowHeight]="getRowHeight(group)"
						  [row]="group"
						  [rowIndex]="getRowIndex(group)"
						  [expanded]="getRowExpanded(group)"
						  [rowClass]="rowClass"
						  (activate)="selector.onActivate($event, i)">
				  </sto-datatable-body-row>
				  <ng-template #groupedRowsTemplate>
				  <sto-datatable-body-row
						  *ngFor="let row of group.value; let i = index; trackBy: rowTrackingFn;"
						  tabindex="-1"
						  [isSelected]="selector.getRowSelected(row)"
						  [innerWidth]="innerWidth"
						  [offsetX]="offsetX"
						  [columns]="columns"
						  [rowHeight]="getRowHeight(row)"
						  [row]="row"
						  [group]="group.value"
						  [rowIndex]="getRowIndex(row)"
						  [expanded]="getRowExpanded(row)"
						  [rowClass]="rowClass"
						  (activate)="selector.onActivate($event, i)">
				  </sto-datatable-body-row>
				  </ng-template>
			  </datatable-row-wrapper>
			  <sto-datatable-fixed-row-wrapper
					  *ngIf="summaryRowData"
					  [ngStyle]="getRowSummaryStyle()"
			  >
				  <sto-datatable-body-row
						  tabindex="-1"
						  [innerWidth]="innerWidth"
						  [offsetX]="offsetX"
						  [row]="summaryRowData"
						  [columns]="summaryColumns"
						  [rowHeight]="getSummaryRowHeight()"
						  [rowClass]="getFooterRowClass"
				  >
				  </sto-datatable-body-row>
			  </sto-datatable-fixed-row-wrapper>
		  </sto-datatable-scroller>
		  <div
				  class="empty-row"
				  *ngIf="!rows?.length"
				  [innerHTML]="emptyMessage">
		  </div>
	  </sto-datatable-selection>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-body'
  }
})
export class StoDataTableBodyComponent extends DataTableBodyComponent {

  _summaryRow: any;
	@ViewChild(StoScrollerComponent) scroller: StoScrollerComponent;
  @Input() selectByDoubleClick: boolean;
	@Input() canMoveRows: boolean;
	@Input() moveRowMapper: Function;
	@Input() moveRowsCheck: Function;
	@Output() moveRow = new EventEmitter();
	private moveTimeout: any;
	private moveModel: {source: any, target: any, beforeOrAfter: 'before'|'after'};

  /**
   * Creates an instance of DataTableBodyComponent.
   */
  constructor(cd: ChangeDetectorRef, elRef: ElementRef) {
    // declare fn here so we can get access to the `this` property
    super(cd, elRef);

  }

  getSummaryRowHeight() {
    if(this.rows && this.rows.length > 1){
      return this.getRowHeight(this.rows[1]);
    }
    return '100%';
  }

  getRowSummaryStyle() {
		let summaryHeight = 36;
		let scroll = 0;
  	if(this.rows && this.rows.length > 1){
			summaryHeight = this.getRowHeight(this.rows[1]);
		}
    const isCompactMode = summaryHeight <= 35;

    let style = {
    	position: 'fixed'
		};

    const height = parseInt(this.bodyHeight, 0);
    const width = parseInt(this.bodyWidth, 0);
    let colWidth = (this.columns.map(c => {return c.width}).reduce((r, s) => r + s, 0));
    if (colWidth > width) {
      if(!isCompactMode){
				scroll = 14; // maaagic
			}
			else{
      	scroll = 21;
			}
    } else{
      if(isCompactMode){
        scroll = 8;
      }
    }
    translateXY(style, 0, height - summaryHeight - scroll);

    return style;
  }
  private canMoveRow(row: any, target: any): boolean {
    let canMove: boolean;
    if (this.moveRowsCheck && typeof this.moveRowsCheck === 'function') {
      canMove = this.moveRowsCheck(row, target);
    }
    if (canMove) {
      canMove = !this.loadingIndicator;
    }
    return canMove;
  }

  public onMoveRow({fromIndex, toIndex, event}) {
    let source = this.temp[fromIndex];
    const target = this.temp[toIndex];
    const beforeOrAfter = fromIndex > toIndex ? 'before' : 'after';
    if (!this.canMoveRow(source, target)) {
      this.setMoveErrorClasses(event, fromIndex, toIndex);
      return; // Do nothing if loading is true
    }
    // Index we get is from the temp rows (scroll area), but moving happens on the actual rows
    const actualFromIndex = this.rows.findIndex(r => r === source);
    const diffedIndex = toIndex - fromIndex;
    const actualToIndex = diffedIndex + actualFromIndex;
    if (this.moveModel && this.moveModel.source !== source) {
      // Tried moving a different row - emit update and clear timeout
      clearTimeout(this.moveTimeout);
      this.moveRow.emit({...this.moveModel});
      this.moveModel = null;
      return;
    }
    const rows = [...this.rows];
    if (this.moveRowMapper && typeof this.moveRowMapper === 'function') {
      source = this.moveRowMapper(source, target);
    }
    rows[actualToIndex] = source;
    rows[actualFromIndex] = target;
    this.rows = rows;
    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
    }
    this.moveModel = {
      source,
      target,
      beforeOrAfter
    };
    // Debounce
    this.moveTimeout = setTimeout(() => {
      this.moveRow.emit({...this.moveModel});
      this.moveModel = null;
    }, 1000);
  }

  private setMoveErrorClasses(event: any, fromIndex: any, toIndex: any) {
    const el: HTMLElement = event.target;
    const direction = fromIndex > toIndex ? 'up' : 'down';
    const moveClasses = ['datatable-body-row--move', `datatable-body-row--move--error-${direction}`];
    el.classList.add(...moveClasses);
    setTimeout(() => el.classList.remove(...moveClasses), 500);
    setTimeout(() => el.focus()); // revert focus
  }

  private _summaryColumns;
  @Input() set summaryColumns(val: TableColumn[]) {

    setColumnDefaults(val);

    this._summaryColumns = val;
  }

  get summaryColumns(): TableColumn[] {
    return this._summaryColumns;
  }

  private _summaryRowData;
  @Input() set summaryRowData(val: any) {

    this._summaryRowData = val;
  }

  get summaryRowData(): any {
    return this._summaryRowData;
  }


  getFooterRowClass() {
    return 'datatable-footer-summary-row';
  }
}

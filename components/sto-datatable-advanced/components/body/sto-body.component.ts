import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { translateXY } from '../../../../vendor/ngx-datatable/utils';
import { DataTableBodyComponent } from '../../../../vendor/ngx-datatable/components/body/body.component';
import { TableColumn } from '../../../../vendor/ngx-datatable/types/table-column.type';
import { setColumnDefaults } from '../../../../vendor/ngx-datatable/utils/column-helper';
import { StoScrollerComponent } from './sto-scroller.component';

@Component({
  selector: 'sto-complex-body',
  template: `
	  <datatable-selection
			  #selector
			  [selected]="selected"
			  [rows]="temp"
			  [selectCheck]="selectCheck"
			  [selectEnabled]="selectEnabled"
			  [selectionType]="selectionType"
			  [rowIdentity]="rowIdentity"
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
						  rowHeight="100%"
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
	  </datatable-selection>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-body'
  }
})
export class StoDataTableBodyComponent extends DataTableBodyComponent {

  _summaryRow: any;
	@ViewChild(StoScrollerComponent) scroller: StoScrollerComponent;

  /**
   * Creates an instance of DataTableBodyComponent.
   */
  constructor(cd: ChangeDetectorRef, elRef: ElementRef) {
    // declare fn here so we can get access to the `this` property
    super(cd, elRef);

  }

  getRowSummaryStyle() {
		let summaryHeight = 36;
		let scroll = 0;
  	if(this.rows && this.rows.length > 1){
			summaryHeight = this.getRowHeight(this.rows[1]);
		}

    let style = {
    	position: 'fixed'
		};

    const height = parseInt(this.bodyHeight, 0);
    const width = parseInt(this.bodyWidth, 0);
    let colWidth = (this.columns.map(c => {return c.width}).reduce((r, s) => r + s, 0));
    if (colWidth > width) {
      if(summaryHeight > 35){
				scroll = 16;
			}
			else{
      	scroll = 21;
			}
    }
    translateXY(style, 0, height - summaryHeight - scroll);

    return style;
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

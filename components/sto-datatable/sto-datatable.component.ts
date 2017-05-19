import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Input, NgModule, Renderer } from '@angular/core';
import {
  ColumnFooters,
  ColumnHeaders,
  DataTable,
  DataTableModule,
  DTCheckbox,
  DTRadioButton,
  RowExpansionLoader,
  ScrollableView,
  TableBody
} from '../../vendor/primeface/components/datatable/datatable';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ObjectUtils } from '../../vendor/primeface/components/utils/ObjectUtils';
import { Column, SharedModule } from '../../vendor/primeface/components/common/shared';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from '../../vendor/primeface/components/paginator/paginator';
import { FormsModule } from '@angular/forms';
import { StoColumnHeadersComponent } from './sto-datatable-header/sto-datatable-header.component';


@Component({
  selector: 'sto-dtRadioButton',
  template: `
	  <div class="ui-radiobutton ui-widget">
		  <div class="ui-helper-hidden-accessible">
			  <input type="radio" [checked]="checked">
		  </div>
		  <div class="ui-radiobutton-box ui-widget ui-radiobutton-relative ui-state-default"
			   (click)="handleClick($event)"
			   (mouseenter)="hover=true" (mouseleave)="hover=false"
			   [ngClass]="{'ui-state-hover':hover,'ui-state-active':checked}">
			  <span class="ui-radiobutton-icon" [ngClass]="{'fa fa-circle':checked}"></span>
		  </div>
	  </div>
  `
})
export class StoDTRadioButton extends DTRadioButton {
}

@Component({
  selector: 'sto-dtCheckbox',
  template: `
	  <div class="ui-chkbox ui-widget">
		  <div class="ui-helper-hidden-accessible">
			  <input type="checkbox" [checked]="checked">
		  </div>
		  <div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default" (click)="handleClick($event)"
			   (mouseover)="hover=true" (mouseout)="hover=false"
			   [ngClass]="{'ui-state-hover':hover&&!disabled,'ui-state-active':checked&&!disabled,'ui-state-disabled':disabled}">
			  <span class="ui-chkbox-icon ui-c" [ngClass]="{'fa fa-check':checked}"></span>
		  </div>
	  </div>
  `
})
export class StoDTCheckbox extends DTCheckbox {
}

@Component({
  selector: 'sto-rowExpansionLoader',
  template: ``
})
export class StoRowExpansionLoader extends RowExpansionLoader {
}

@Component({
  selector: '[stoColumnFooters]',
  template: `
	  <td *ngFor="let col of columns" [ngStyle]="col.style" [class]="col.styleClass"
		  [attr.colspan]="col.colspan" [attr.rowspan]="col.rowspan"
		  [ngClass]="{'ui-state-default':true}" [style.display]="col.hidden ? 'none' : 'table-cell'">
		  <span class="ui-column-footer" *ngIf="!col.footerTemplate">{{col.footer}}</span>
		  <span class="ui-column-footer" *ngIf="col.footerTemplate">
                <p-columnFooterTemplateLoader [column]="col"></p-columnFooterTemplateLoader>
            </span> 
	  </td>
  `
})
export class StoColumnFooters {
  constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt:StoDatatableComponent) {}
  @Input("stoColumnFooters") columns: Column[];
}

@Component({
  selector: '[stoTableBody]',
  template: `
	  <ng-template ngFor let-rowData [ngForOf]="dt.dataToRender" let-even="even" let-odd="odd" let-rowIndex="index">
		  <tr #rowGroupElement class="ui-widget-header ui-rowgroup-header"
			  *ngIf="dt.rowGroupMode=='subheader' && (rowIndex === 0||(dt.resolveFieldData(rowData,dt.groupField) !== dt.resolveFieldData(dt.dataToRender[rowIndex - 1], dt.groupField)))"
			  (click)="dt.onRowGroupClick($event)" [ngStyle]="{'cursor': dt.sortableRowGroup ? 'pointer' : 'auto'}">
			  <td [attr.colspan]="columns.length">
				  <a href="#" *ngIf="dt.expandableRowGroups" (click)="dt.toggleRowGroup($event,rowData)">
					  <span class="fa fa-fw"
							[ngClass]="{'fa-chevron-circle-down':dt.isRowGroupExpanded(rowData), 'fa-chevron-circle-right': !dt.isRowGroupExpanded(rowData)}"></span>
				  </a>
				  <span class="ui-rowgroup-header-name">
                        <p-templateLoader [template]="dt.rowGroupHeaderTemplate" [data]="rowData"></p-templateLoader>
                    </span>
			  </td>
		  </tr>
		  <tr #rowElement *ngIf="!dt.expandableRowGroups||dt.isRowGroupExpanded(rowData)"
			  [class]="dt.getRowStyleClass(rowData,rowIndex)"
			  (click)="dt.handleRowClick($event, rowData)" (dblclick)="dt.rowDblclick($event,rowData)"
			  (contextmenu)="dt.onRowRightClick($event,rowData)" (touchend)="dt.handleRowTouchEnd($event)"
			  [ngClass]="{'ui-datatable-even':even&&dt.rowGroupMode!='rowspan','ui-datatable-odd':odd&&dt.rowGroupMode!='rowspan','ui-state-highlight': dt.isSelected(rowData)}">
			  <ng-template ngFor let-col [ngForOf]="columns" let-colIndex="index">
				  <td #cell *ngIf="!dt.rowGroupMode || (dt.rowGroupMode == 'subheader') ||
                        (dt.rowGroupMode=='rowspan' && ((dt.sortField==col.field && dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].index == rowIndex) || (dt.sortField!=col.field)))"
					  [ngStyle]="col.style" [class]="col.styleClass"
					  [style.display]="col.hidden ? 'none' : 'table-cell'"
					  [ngClass]="{'ui-editable-column':col.editable,'ui-selection-column':col.selectionMode}"
					  (click)="dt.switchCellToEditMode(cell,col,rowData)"
					  [attr.rowspan]="(dt.rowGroupMode=='rowspan' && dt.sortField == col.field && dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].index == rowIndex) ? dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].size : null">
					  <span class="ui-column-title" *ngIf="dt.responsive">{{col.header}}</span>
					  <span class="ui-cell-data"
							*ngIf="!col.bodyTemplate && !col.expander && !col.selectionMode">{{dt.resolveFieldData(rowData, col.field)}}</span>
					  <span class="ui-cell-data" *ngIf="col.bodyTemplate">
                            <p-columnBodyTemplateLoader [column]="col" [rowData]="rowData"
														[rowIndex]="rowIndex + dt.first"></p-columnBodyTemplateLoader>
                        </span>
					  <div class="ui-cell-editor" *ngIf="col.editable">
						  <input *ngIf="!col.editorTemplate" type="text" [(ngModel)]="rowData[col.field]"
								 required="true"
								 (keydown)="dt.onCellEditorKeydown($event, col, rowData, rowIndex)"
								 class="ui-inputtext ui-widget ui-state-default ui-corner-all"/>
						  <a *ngIf="col.editorTemplate" class="ui-cell-editor-proxy-focus" href="#"
							 (focus)="dt.onCustomEditorFocusPrev($event, colIndex)"></a>
						  <p-columnEditorTemplateLoader *ngIf="col.editorTemplate" [column]="col" [rowData]="rowData"
														[rowIndex]="rowIndex"></p-columnEditorTemplateLoader>
						  <a *ngIf="col.editorTemplate" class="ui-cell-editor-proxy-focus" href="#"
							 (focus)="dt.onCustomEditorFocusNext($event, colIndex)"></a>
					  </div>
					  <a href="#" *ngIf="col.expander" (click)="dt.toggleRow(rowData,$event)">
						  <span class="ui-row-toggler fa fa-fw ui-c"
								[ngClass]="{'fa-chevron-circle-down':dt.isRowExpanded(rowData), 'fa-chevron-circle-right': !dt.isRowExpanded(rowData)}"></span>
					  </a>
					  <sto-dtRadioButton *ngIf="col.selectionMode=='single'"
									   (onClick)="dt.selectRowWithRadio($event, rowData)"
									   [checked]="dt.isSelected(rowData)"></sto-dtRadioButton>
					  <sto-dtCheckbox *ngIf="col.selectionMode=='multiple'"
									(onChange)="dt.toggleRowWithCheckbox($event,rowData)"
									[checked]="dt.isSelected(rowData)"></sto-dtCheckbox>
				  </td>
			  </ng-template>
		  </tr>
		  <tr class="ui-widget-header"
			  *ngIf="dt.rowGroupFooterTemplate && dt.rowGroupMode=='subheader' && ((rowIndex === dt.dataToRender.length - 1)||(dt.resolveFieldData(rowData,dt.groupField) !== dt.resolveFieldData(dt.dataToRender[rowIndex + 1],dt.groupField))) && (!dt.expandableRowGroups || dt.isRowGroupExpanded(rowData))">
			  <p-templateLoader class="ui-helper-hidden" [data]="rowData"
								[template]="dt.rowGroupFooterTemplate"></p-templateLoader>
		  </tr>
		  <tr *ngIf="dt.expandableRows && dt.isRowExpanded(rowData)">
			  <td [attr.colspan]="dt.visibleColumns().length">
				  <sto-rowExpansionLoader [rowData]="rowData" [template]="dt.rowExpansionTemplate"></sto-rowExpansionLoader>
			  </td>
		  </tr>
	  </ng-template>

	  <tr *ngIf="dt.isEmpty()" class="ui-widget-content">
		  <td [attr.colspan]="dt.visibleColumns().length" class="ui-datatable-emptymessage">{{dt.emptyMessage}}</td>
	  </tr>
  `
})
export class StoTableBody {

  constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt:StoDatatableComponent) {}

  @Input('stoTableBody') columns: Column[];

  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }
}

@Component({
  selector: '[stoScrollableView]',
  template: `
	  <div #scrollHeader class="ui-widget-header ui-datatable-scrollable-header" [ngStyle]="{'width': width}">
		  <div #scrollHeaderBox class="ui-datatable-scrollable-header-box">
			  <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
				  <thead class="ui-datatable-thead">
				  <tr *ngIf="!dt.headerColumnGroup" class="ui-state-default" [pColumnHeaders]="columns"></tr>
				  <ng-template [ngIf]="dt.headerColumnGroup">
					  <tr *ngFor="let headerRow of dt.headerColumnGroup.rows" class="ui-state-default"
						  [pColumnHeaders]="headerRow.columns"></tr>
				  </ng-template>
				  </thead>
			  </table>
		  </div>
	  </div>
	  <div #scrollBody class="ui-datatable-scrollable-body" [ngStyle]="{'width': width,'max-height':dt.scrollHeight}">
		  <div #scrollTableWrapper style="position:relative" [ngStyle]="{'height':virtualTableHeight}">
			  <table #scrollTable [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle"
					 [ngClass]="{'ui-datatable-virtual-table':virtualScroll}" style="top:0px">
				  <colgroup class="ui-datatable-scrollable-colgroup">
					  <col *ngFor="let col of dt.visibleColumns()"/>
				  </colgroup>
				  <tbody [ngClass]="{'ui-datatable-data ui-widget-content': true, 'ui-datatable-hoverable-rows': (dt.rowHover||dt.selectionMode)}"
						 [pTableBody]="columns"></tbody>
			  </table>
		  </div>
	  </div>
	  <div #scrollFooter class="ui-widget-header ui-datatable-scrollable-footer" [ngStyle]="{'width': width}"
		   *ngIf="dt.hasFooter()">
		  <div #scrollFooterBox class="ui-datatable-scrollable-footer-box">
			  <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
				  <tfoot class="ui-datatable-tfoot">
				  <tr *ngIf="!footerColumnGroup" [pColumnFooters]="columns" class="ui-state-default"></tr>
				  <ng-template [ngIf]="footerColumnGroup">
					  <tr *ngFor="let footerRow of footerColumnGroup.rows" [pColumnFooters]="footerRow.columns"></tr>
				  </ng-template>
				  </tfoot>
			  </table>
		  </div>
	  </div>
  `
})
export class StoScrollableView extends ScrollableView {

  constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt: StoDatatableComponent, public domHandler: DomHandler, public el: ElementRef, public renderer: Renderer) {
    super(dt, domHandler, el, renderer);
  }
}

@Component({
  selector: 'sto-datatable',
  templateUrl: './sto-datatable.component.html',
  styleUrls: ['./sto-datatable.component.scss'],
  providers: [DomHandler, ObjectUtils]
})
export class StoDatatableComponent extends DataTable {

  constructor(public el: ElementRef, public domHandler: DomHandler,
              public renderer: Renderer, public changeDetector: ChangeDetectorRef, public objectUtils: ObjectUtils) {
    super(el, domHandler, renderer, changeDetector, objectUtils);
  }
}
@NgModule({
  imports: [DataTableModule, CommonModule, SharedModule, PaginatorModule, FormsModule],
  exports: [
    SharedModule,
    StoDatatableComponent,
    StoDTRadioButton,
    StoDTCheckbox,
    StoColumnHeadersComponent,
    StoColumnFooters,
    StoTableBody,
    StoScrollableView,
    StoRowExpansionLoader
  ],
  declarations: [
    StoDatatableComponent,
    StoDTRadioButton,
    StoDTCheckbox,
    StoColumnHeadersComponent,
    StoColumnFooters,
    StoTableBody,
    StoScrollableView,
    StoRowExpansionLoader]
})
export class StoDataTableModule {
}

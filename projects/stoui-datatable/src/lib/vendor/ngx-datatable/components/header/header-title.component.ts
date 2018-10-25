import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { SelectionType, SortType, TableColumn } from '../../types';

@Component({
  selector: 'datatable-header-title',
  template: `
	  <div>

		  <span
				  *ngIf="!column.headerTemplate"
				  class="datatable-header-cell-wrapper">
        <span
				class="datatable-header-cell-label"
				[innerHTML]="name">
        </span>
      </span>
		  <ng-template
				  *ngIf="column.headerTemplate"
				  [ngTemplateOutlet]="column.headerTemplate"
				  [ngTemplateOutletContext]="cellContext">
		  </ng-template>
		  <span>
      </span>
	  </div>
  `,
  host: {
    class: 'datatable-header-title'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataTableHeaderTitleComponent {


  @Input() allRowsSelected: boolean;
  @Input() selectionType: SelectionType;

  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;
    this.cd.markForCheck();
  }

  get column(): TableColumn {
    return this._column;
  }

  @HostBinding('style.height.px')
  @Input() headerHeight: number;


  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() columnContextmenu = new EventEmitter<{ event: MouseEvent, column: any }>(false);

  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-header-cell';

    if (this.column.sortable) {
      cls += ' sortable';
    }
    if (this.column.resizeable) {
      cls += ' resizeable';
    }
    if (this.column.headerClass) {
      if (typeof this.column.headerClass === 'string') {
        cls += ' ' + this.column.headerClass;
      } else if (typeof this.column.headerClass === 'function') {
        const res = this.column.headerClass({
          column: this.column
        });

        if (typeof res === 'string') {
          cls += res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) {
              cls += ` ${k}`;
            }
          }
        }
      }
    }


    return cls;
  }

  @HostBinding('attr.title')
  get name(): string {
    // guaranteed to have a value by setColumnDefaults() in column-helper.ts
    return this.column.headerTemplate === undefined ? this.column.name : undefined;
  }

  @HostBinding('style.minWidth.px')
  get minWidth(): number {
    return this.column.minWidth;
  }

  @HostBinding('style.maxWidth.px')
  get maxWidth(): number {
    return this.column.maxWidth;
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  get isCheckboxable(): boolean {
    return this.column.checkboxable &&
      this.column.headerCheckboxable &&
      this.selectionType === SelectionType.checkbox;
  }

  selectFn = this.select.emit.bind(this.select);

  cellContext: any = {
    column: this.column,
    allRowsSelected: this.allRowsSelected,
    selectFn: this.selectFn
  };

  private _column: TableColumn;
  private _sorts: any[];

  constructor(private cd: ChangeDetectorRef) {
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({event: $event, column: this.column});
  }


}

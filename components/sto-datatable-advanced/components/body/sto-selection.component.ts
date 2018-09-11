import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {
  DataTableSelectionComponent,
  Model
} from '../../../../vendor/ngx-datatable/components/body/selection.component';
import { Key } from '../../../shared/abstract-and-interfaces/keyPress.enum';
import { SelectionType } from '../../../../vendor/ngx-datatable/types/selection.type';
import { Keys } from '../../../../vendor/ngx-datatable/utils';

@Component({
  selector: 'sto-datatable-selection',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoDataTableSelectionComponent extends DataTableSelectionComponent {
  @Input() canMoveRows: boolean;
  @Input() selectByDoubleClick: boolean;
  @Output() moveRow = new EventEmitter<{fromIndex: number, toIndex: number, event: KeyboardEvent}>();
  public previousSelectedRow: HTMLElement;

  onActivate(model: Model, index: number): void {
    const { type, event, row } = model;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const singleClick = !chkbox && type === 'click';
    const clickShouldSelect = singleClick && this.shouldOpenRow(model);
    const select = (!chkbox && type === 'dblclick') || (chkbox && type === 'checkbox') || clickShouldSelect;
    if (select) {
      this.selectRow(event, index, row);
    } else if (type === 'keydown') {
      if ((<KeyboardEvent>event).keyCode === Keys.return) {
        this.selectRow(event, index, row);
      } else {
        this.onKeyboardFocus(model);
      }
    } else if (singleClick && this.selectByDoubleClick) {
      this.focusCurrentRow(model.rowElement);
    }
    this.activate.emit(model);
    if (type === 'dblclick') {
      window.getSelection().removeAllRanges();
    }
  }
  private shouldOpenRow(model: Model): boolean {
    if (!this.selectByDoubleClick) { // ignore all checks
      return true;
    }
    const isSame = model.rowElement === this.previousSelectedRow;
    const hasOpenRow = (this.selected || []).length > 0;
    // Cache the activated rowElement, and clear it after 1 second (essentially a doubleclick with gracetime)
    this.previousSelectedRow = model.rowElement;
    setTimeout(() => this.previousSelectedRow = null, 1000);
    return isSame || hasOpenRow;
  }

  focusCurrentRow(rowElement: HTMLElement): void {
    rowElement.focus();
  }

  focusRow(rowElement: any, keyCode: number): void {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement && !nextRowElement.classList.contains('datatable-footer-summary-row--fixed')) {
      nextRowElement.focus();
    }
  }
  onKeyboardFocus(model: Model): void {
    const event = <KeyboardEvent>model.event;
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      this.onAlternateKeyboardFocus(model);
    }
      let keyCode = event.keyCode;
      if (keyCode === Key.K) {
        keyCode = Key.UpArrow;
      }
      if (keyCode === Key.J) {
        keyCode = Key.DownArrow;
      }
      const shouldFocus =
        keyCode === Key.UpArrow ||
        keyCode === Key.DownArrow ||
        keyCode === Key.RightArrow ||
        keyCode === Key.LeftArrow;

      if (shouldFocus) {
        const isCellSelection =
          this.selectionType === SelectionType.cell;

        if (!model.cellElement || !isCellSelection) {
          this.focusRow(model.rowElement, keyCode);
        } else if (isCellSelection) {
          this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex);
        }
    }
  }
  private onAlternateKeyboardFocus(model: Model): void {
    const event = <KeyboardEvent>model.event;
    const {ctrlKey, keyCode} = event;
    if (ctrlKey && (keyCode === Key.DownArrow || keyCode === Key.UpArrow)) {
      const fromIndex = this.rows.findIndex(x => x === model.row);
      const toIndex = keyCode === Key.DownArrow ? fromIndex + 1 : fromIndex - 1;
      this.moveRow.emit({fromIndex, toIndex, event});
    }
  }
}

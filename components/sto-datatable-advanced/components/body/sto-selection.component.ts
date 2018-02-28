import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DataTableSelectionComponent,
  Model
} from '../../../../vendor/ngx-datatable/components/body/selection.component';
import { Key } from '../../../shared/abstract-and-interfaces/keyPress.enum';
import { SelectionType } from '../../../../vendor/ngx-datatable/types/selection.type';

@Component({
  selector: 'sto-datatable-selection',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoDataTableSelectionComponent extends DataTableSelectionComponent {
  focusRow(rowElement: any, keyCode: number): void {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement && !nextRowElement.classList.contains('datatable-footer-summary-row')) {
      nextRowElement.focus();
    }
  }
  onKeyboardFocus(model: Model): void {
    let { keyCode } = <KeyboardEvent>model.event;
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
}

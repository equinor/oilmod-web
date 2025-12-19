import { Component, input } from '@angular/core';

@Component({
  selector: 'sto-datatable-actions',
  templateUrl: './sto-datatable-actions.component.html',
  styleUrl: './sto-datatable-actions.component.scss',
  host: {
    class: 'sto-mdl-table__actions',
    '[style.height.px]': 'height()',
  },
})
export class StoDatatableActionsComponent {
  height = input(47);
}

@Component({
  selector: 'sto-datatable-actions-left',
  template: ` <ng-content></ng-content>`,
  host: { class: 'class.sto-mdl-table__actions__left' },
})
export class StoDataTableActionsLeftComponent {}

@Component({
  selector: 'sto-datatable-actions-right',
  template: ` <ng-content></ng-content>`,
  host: { class: 'class.sto-mdl-table__actions__right' },
})
export class StoDataTableActionsRightComponent {}

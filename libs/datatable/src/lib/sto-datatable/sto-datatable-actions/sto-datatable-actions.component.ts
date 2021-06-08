import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'sto-datatable-actions',
  templateUrl: './sto-datatable-actions.component.html',
  styleUrls: [ './sto-datatable-actions.component.scss' ],
})

export class StoDatatableActionsComponent {
  @HostBinding('class.sto-mdl-table__actions')
  getClass = true;
  @HostBinding('style.height.px')
  @Input()
  height = 40;

}

@Component({
  selector: 'sto-datatable-actions-left',
  template: `
    <ng-content></ng-content>`
})
export class StoDataTableActionsLeftComponent {
  @HostBinding('class.sto-mdl-table__actions__left')
  getClass = true;
}

@Component({
  selector: 'sto-datatable-actions-right',
  template: `
    <ng-content></ng-content>`
})
export class StoDataTableActionsRightComponent {
  @HostBinding('class.sto-mdl-table__actions__right')
  getClass = true;
}


import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sto-datatable-actions',
  templateUrl: './sto-datatable-actions.component.html',
  styleUrls: [ './sto-datatable-actions.component.scss' ],
})

export class StoDatatableActionsComponent implements OnInit {
  @HostBinding('class.sto-mdl-table__actions') true;
  @HostBinding('style.height.px')
  @Input()
  height = 40;

  constructor() {
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'sto-datatable-actions-left',
  template: `
    <ng-content></ng-content>`
})
export class StoDataTableActionsLeftComponent {
  @HostBinding('class.sto-mdl-table__actions__left') true;
}

@Component({
  selector: 'sto-datatable-actions-right',
  template: `
    <ng-content></ng-content>`
})
export class StoDataTableActionsRightComponent {
  @HostBinding('class.sto-mdl-table__actions__right') true;
}


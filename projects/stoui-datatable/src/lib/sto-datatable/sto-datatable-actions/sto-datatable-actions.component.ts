import { Component, Directive, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'sto-datatable-actions',
  templateUrl: './sto-datatable-actions.component.html',
  styleUrls: [ './sto-datatable-actions.component.scss' ],
})

export class StoDatatableActionsComponent implements OnInit {
  @HostBinding('class.sto-mdl-table__actions') true;

  constructor() {
  }

  ngOnInit(): void {
  }

}

@Directive({
  selector: 'sto-datatable-actions-left'
})
export class StoDataTableActionsLeft {
}

@Directive({
  selector: 'sto-datatable-actions-right',
})
export class StoDataTableActionsRight {
  @HostBinding('class.sto-mdl-table__actions__right') true;
}


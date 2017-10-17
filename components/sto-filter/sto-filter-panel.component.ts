import { Component, Directive, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';


@Component({
  styleUrls: ['sto-filter-panel.component.scss'],
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StoFilterPanelComponent implements OnInit {
  @Input() expandable: true;
  public expanded: boolean = false;

  public toggle() {
    this.expanded = !this.expanded;
  }

  ngOnInit() {
    if (this.expandable) {
      this.expanded = true;
    }
  }
}

/**
 * <mat-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
@Directive({
  selector: 'sto-filter-title'
})
export class StoFilterTitle {
}


@Directive({
  selector: 'sto-filter-table-actions',
  host: {
    class: 'sto-filter-table-actions'
  }
})
export class StoFilterTableActions {
}

@Directive({
  selector: 'sto-filter-actions'
})
export class StoFilterActions {
}

@Component({
  selector: 'sto-filter-actions-bar',
  host: {
    class: 'sto-filter-actions'
  },

  template: `
	  <ng-content></ng-content>
	  <mat-button-toggle *ngIf="expandable" style="box-shadow:none" [checked]="true" (change)="onChange($event)" 
                      (click)="toggle.emit()">
		  <mat-icon>filter_list</mat-icon>
	  </mat-button-toggle>

  `
})
export class StoFilterActionsBar {
  @Input() expandable: boolean;
  private _expanded: boolean;

  @Input() set expanded(expanded: boolean) {
    this._expanded = expanded;
  }

  get expanded(): boolean {
    return this._expanded;
  }
  onChange($event){
    console.log($event);
  }

  @Output() toggle = new EventEmitter<void>();


}


import { Component, Output, Directive, EventEmitter, ViewEncapsulation, OnInit} from '@angular/core';


@Component({
  styleUrls: ['sto-filter-panel.component.scss'],
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class StoFilterPanelComponent implements OnInit{
  public expanded = true;

  public toggle(){
    this.expanded = !this.expanded;
  }

  ngOnInit(){}


}

/**
 * <md-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
@Directive({
  selector: 'sto-filter-title'
})
export class StoFilterTitle {}


@Directive({
  selector: 'sto-filter-table-actions',
  host : {
    class: 'sto-filter-table-actions'
  }
})
export class StoFilterTableActions {}

@Directive({
  selector: 'sto-filter-actions'
})
export class StoFilterActions {}

@Component({
  selector: 'sto-filter-actions-bar',
  host : {
    class: 'sto-filter-actions'
  },
  template: `
	    <ng-content></ng-content>  
      <md-icon (click)="toggle.emit()">filter_list</md-icon>
  `
})
export class StoFilterActionsBar {
    @Output() toggle = new EventEmitter<void>();
}


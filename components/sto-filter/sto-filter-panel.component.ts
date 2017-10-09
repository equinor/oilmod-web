import { Component,Input, Output, Directive, EventEmitter, ViewEncapsulation, OnInit} from '@angular/core';


@Component({
  styleUrls: ['sto-filter-panel.component.scss'],
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StoFilterPanelComponent implements OnInit{
  @Input() expandable : true;
  public expanded : boolean = true;

  public toggle(){
    this.expanded = !this.expanded;
  }

  ngOnInit(){
    if(this.expandable){
      this.expanded = true;
    }
  }
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
      <md-icon *ngIf="expandable" (click)="toggle.emit()">filter_list</md-icon>
  `
})
export class StoFilterActionsBar {
  @Input() expandable: boolean;
  @Output() toggle = new EventEmitter<void>();
}


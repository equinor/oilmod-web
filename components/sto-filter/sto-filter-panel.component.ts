import { ViewChild, AfterViewInit, Component, Directive, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StoFilterPanelComponent implements OnInit, AfterViewInit {
  @Input() expandable: true;
  @ViewChild('contentWrapper') contentWrapper;
  @ViewChild('contentWrapper2') contentWrapper2;
  @Output() toggled = new EventEmitter();


  public hasSeperator = false;
  public expanded: boolean = false;

  public toggle() {
    this.expanded = !this.expanded;
    this.toggled.emit(this.expanded);
  }

  ngOnInit() {
    if (this.expandable) {
      this.expanded = true;
    }
    this.needSeperator();
  }

  ngAfterViewInit(){
    this.needSeperator();
  }
  public needSeperator(){
    this.hasSeperator = false;
    if(this.contentWrapper && this.contentWrapper2) {
      const el1 = this.contentWrapper.nativeElement;
      const el2 = this.contentWrapper2.nativeElement;
      if (el1.children && el2.children) {
        if(el1.children.length > 0 && el2.children.length > 0){
          const hasActionButtons = el1.children[0].children.length > 0;
          const hasTableButtons = el2.children[0].children.length > 0;

          this.hasSeperator = hasActionButtons && hasTableButtons
          this.cdr.detectChanges();
        }
      }
    }


  }

  constructor(private cdr: ChangeDetectorRef) {
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
	  <mat-button-toggle class="icon" *ngIf="expandable" style="box-shadow:none" [checked]="true" (change)="onChange($event)"
	                      matTooltip="Toggle filter panel"
	                      matTooltipClass="nowrap"
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
    // console.log($event);
  }

  @Output() toggle = new EventEmitter<void>();


}


import {
  ViewChild,
  AfterViewInit,
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';

/**
 * Sto filter panel is an extentiong
 */
@Component({
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sto-filter-panel.component.scss']
})
export class StoFilterPanelComponent implements OnInit, AfterViewInit {

  /**
   * If the filter panel should be expandable. Default true.
   */
  @Input() expandable: true;

  /**
   * If the filter panel should be expanded by default. Default false.
   */
  @Input() public expanded;

  /**
   * Emits {isExpanded: boolean, contentHeight: number } where
   * isExpanded is true if the panel opens and false if not.
   * ContentHeight is the height of the expanded content i pixels.
   *  {EventEmitter<{isExpanded: boolean, contentHeight: number }>}
   */
  @Output() toggled = new EventEmitter<{ isExpanded: boolean, contentHeight: number }>();

  /**
   * Buttons and actions on the left side of the separator if both table and filter actions is present.
   */
  @ViewChild('tableActions') contentWrapper;
  /**
   * Buttons and actions on the right side of the separator if both table and filter actions is present.
   */
  @ViewChild('filterActions') contentWrapper2;
  @ViewChild('filterForm') filterForm;

  private _contentHeight: number;
  set contentHeight(contentHeight: number) {
    this._contentHeight = contentHeight;
  }

  get contentHeight(): number {
    return this._contentHeight;
  }

  public hasSeperator = false;

  public toggle() {
    this.expanded = !this.expanded;
    this.setContentHeight();
    this.toggled.emit({isExpanded: this.expanded, contentHeight: this.contentHeight});
  }

  ngOnInit() {
    if (this.expandable) {
      if (this.expanded === undefined) {
        this.expanded = true;
      } else {
        this.expanded = false;
      }
    } else {
      this.expanded = false;
    }

    this.needSeperator();
  }

  ngAfterViewInit() {
    this.needSeperator();
    this.setContentHeight();
  }

  private setContentHeight() {
    const element = this.filterForm.nativeElement;
    if (element) {
      const contentArea = element.parentElement;
      this.contentHeight = contentArea.offsetHeight;
    }
  }

  public needSeperator() {
    this.hasSeperator = false;
    if (this.contentWrapper && this.contentWrapper2) {
      const el1 = this.contentWrapper.nativeElement;
      const el2 = this.contentWrapper2.nativeElement;
      if (el1.children && el2.children) {
        if (el1.children.length > 0 && el2.children.length > 0) {
          const hasActionButtons = el1.children[0].children.length > 0;
          const hasTableButtons = el2.children[0].children.length > 0;

          this.hasSeperator = hasActionButtons && hasTableButtons;
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
                       title="Toggle filter panel"
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

  onChange($event) {
    // console.log($event);
  }

  @Output() toggle = new EventEmitter<void>();


}

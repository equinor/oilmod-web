/* eslint-disable @angular-eslint/directive-class-suffix,@angular-eslint/directive-selector */
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatChipListbox,
  MatChipOption,
  MatChipRemove,
} from '@angular/material/chips';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FilterForm, FilterList } from './filter';

@Component({
  selector: 'sto-filter-panel',
  standalone: true,
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sto-filter-panel.component.scss'],
  imports: [
    MatExpansionPanel,
    NgClass,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatChipListbox,
    MatChipOption,
    MatIcon,
    MatChipRemove,
    forwardRef(() => StoFilterActionsBar),
  ],
})
/**
 * @deprecated sto-filter-panel should not be used in future application
 * Sto filter panel is an extension of mat-accordion
 */
export class StoFilterPanelComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private vcRef = inject(ViewContainerRef);

  /**
   * If the filter panel should be expandable. Default true.
   */
  @Input()
  expandable = true;
  /**
   * If the filter panel should be expanded by default. Default false.
   */
  @Input()
  expanded: boolean;
  /**
   * List of active filters.
   */
  @Input()
  filterList: FilterList[];
  /**
   * Emits {isExpanded: boolean, contentHeight: number } where
   * isExpanded is true if the panel opens and false if not.
   * ContentHeight is the height of the expanded content i pixels.
   *  {EventEmitter<{isExpanded: boolean, contentHeight: number }>}
   */
  @Output() toggled = new EventEmitter<{
    isExpanded: boolean;
    contentHeight: number;
  }>();
  /**
   * Emits when a filter should be cleared (if applicable)
   */
  @Output()
  clearFilter = new EventEmitter();
  /**
   * Buttons and actions on the left side of the separator if both table and filter actions is present.
   */
  @ViewChild('tableActions') contentWrapper: { nativeElement: HTMLElement };
  /**
   * Buttons and actions on the right side of the separator if both table and filter actions is present.
   */
  @ViewChild('filterActions') contentWrapper2: { nativeElement: HTMLElement };
  @ViewChild('filterForm') filterForm: { nativeElement: HTMLElement };
  @Input()
  public host: FilterForm<Record<string, unknown>>;
  public hasSeperator = false;

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.host = (this.vcRef as any)._view.context;
    } catch (ex) {
      // most likely this fails only for tests after Ivy (Angular 9), as it no longer wraps with a component.
    }
  }

  private _contentHeight: number;

  get contentHeight(): number {
    return this._contentHeight;
  }

  set contentHeight(contentHeight: number) {
    this._contentHeight = contentHeight;
  }

  public toggle() {
    this.expanded = !this.expanded;
    this.setContentHeight();
    this.toggled.emit({
      isExpanded: this.expanded,
      contentHeight: this.contentHeight,
    });
  }

  ngOnInit() {
    console.warn(
      `StoFilterPanel should not be used in future applications, and will be removed in a future release.`,
    );
    if (this.expandable) {
      if (this.expanded === undefined) {
        this.expanded = true;
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

  _clearFilter(key: string, index?: number) {
    if (index === null) {
      return;
    }
    try {
      this.host.clearFilter(key, index);
    } catch {
      this.clearFilter.emit({ key, index });
    }
  }

  private setContentHeight() {
    const element = this.filterForm.nativeElement;
    if (element) {
      const contentArea = element.parentElement;
      this.contentHeight = contentArea?.offsetHeight || 0;
    }
  }
}

/**
 * <mat-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sto-filter-title',
  standalone: true,
})
export class StoFilterTitle {}

@Directive({ selector: 'sto-filter-table-actions', standalone: true })
export class StoFilterTableActions {
  @HostBinding('class.sto-filter-table-actions')
  className = true;
}

@Directive({ selector: 'sto-filter-actions', standalone: true })
export class StoFilterActions {}

@Component({
  selector: 'sto-filter-actions-bar',
  standalone: true,
  template: `
    <ng-content></ng-content>
    @if (expandable) {
      <button
        mat-icon-button
        class="toggle-expand-button"
        title="Toggle filter panel"
        (click)="toggle.emit()"
      >
        <mat-icon>filter_list</mat-icon>
      </button>
    }
  `,
  imports: [MatIconButton, MatIcon],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class StoFilterActionsBar {
  @HostBinding('class.sto-filter-actions')
  hasClass = true;
  @Input() expandable: boolean;
  @Output() toggle = new EventEmitter<void>();

  private _expanded: boolean;

  get expanded(): boolean {
    return this._expanded;
  }

  @Input() set expanded(expanded: boolean) {
    this._expanded = expanded;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange(event: unknown) {
    // console.log($event);
  }
}

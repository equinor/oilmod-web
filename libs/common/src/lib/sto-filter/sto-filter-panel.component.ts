/* eslint-disable @angular-eslint/directive-selector */
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Input,
  OnInit,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatChipListbox,
  MatChipOption,
  MatChipRemove,
} from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FilterForm, FilterList } from './filter';

@Component({
  selector: 'sto-filter-panel',
  standalone: true,
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sto-filter-panel.component.scss'],
  imports: [
    MatExpansionModule,
    NgClass,
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
  expandable = input(true, { transform: booleanAttribute });
  /**
   * If the filter panel should be expanded by default. Default false.
   */
  expanded = model(false);
  /**
   * List of active filters.
   */
  filterList = input<FilterList[]>([]);
  /**
   * Emits {isExpanded: boolean, contentHeight: number } where
   * isExpanded is true if the panel opens and false if not.
   * ContentHeight is the height of the expanded content i pixels.
   *  {EventEmitter<{isExpanded: boolean, contentHeight: number }>}
   */
  readonly toggled = output<{
    isExpanded: boolean;
    contentHeight: number;
  }>();
  /**
   * Emits when a filter should be cleared (if applicable)
   */
  readonly clearFilter = output<{ key: string; index?: number }>();
  /**
   * Buttons and actions on the left side of the separator if both table and filter actions is present.
   */
  contentWrapper = viewChild('tableActions', { read: ElementRef<HTMLElement> });
  /**
   * Buttons and actions on the right side of the separator if both table and filter actions is present.
   */
  filterActions = viewChild('filterActions', { read: ElementRef<HTMLElement> });
  filterForm = viewChild('filterForm', { read: ElementRef<HTMLElement> });
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
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

  private contentHeight = signal(0);

  public toggle() {
    this.expanded.set(!this.expanded());
    this.setContentHeight();
    this.toggled.emit({
      isExpanded: this.expanded(),
      contentHeight: this.contentHeight(),
    });
  }

  ngOnInit() {
    console.warn(
      `StoFilterPanel should not be used in future applications, and will be removed in a future release.`,
    );
    if (!this.expandable()) {
      this.expanded.set(false);
    }

    this.needSeperator();
  }

  ngAfterViewInit() {
    this.needSeperator();
    this.setContentHeight();
  }

  public needSeperator() {
    this.hasSeperator = false;
    if (this.contentWrapper() && this.filterActions()) {
      const el1 = this.contentWrapper()?.nativeElement;
      const el2 = this.filterActions()?.nativeElement;
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
    const element = this.filterForm()?.nativeElement;
    if (element) {
      const contentArea = element.parentElement;
      this.contentHeight.set(contentArea?.offsetHeight || 0);
    }
  }
}

/**
 * <mat-panel-description> directive.
 *
 * This direction is to be used inside of the MdExpansionPanelHeader component.
 */
@Directive({ selector: 'sto-filter-title' })
export class StoFilterTitle {}

@Directive({
  selector: 'sto-filter-table-actions',
  host: { class: 'sto-filter-table-actions' },
})
export class StoFilterTableActions {}

@Directive({ selector: 'sto-filter-actions' })
export class StoFilterActions {}

@Component({
  selector: 'sto-filter-actions-bar',
  template: `
    <ng-content></ng-content>
    @if (expandable()) {
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
  host: {
    class: 'sto-filter-actions-bar',
  },
})
export class StoFilterActionsBar {
  readonly expandable = input<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly toggle = output<void>();

  expanded = input(false, { transform: booleanAttribute });
}

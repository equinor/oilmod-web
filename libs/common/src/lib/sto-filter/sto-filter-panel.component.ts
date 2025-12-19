/* eslint-disable @angular-eslint/directive-selector */
import {
  Component,
  Directive,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  input,
  linkedSignal,
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
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FilterList } from './filter';

/**
 * Directive for projecting content into the filter panel title area.
 * Use this to provide custom title content for the filter panel.
 *
 * @example
 * ```html
 * <sto-filter-panel>
 *   <sto-filter-title>My Filter Title</sto-filter-title>
 * </sto-filter-panel>
 * ```
 */
@Directive({ selector: 'sto-filter-title' })
export class StoFilterTitle {}

/**
 * Directive for projecting table action buttons into the filter panel header.
 * These actions appear on the left side of the header and won't trigger panel expansion when clicked.
 *
 * @example
 * ```html
 * <sto-filter-panel>
 *   <sto-filter-table-actions>
 *     <button>Export</button>
 *   </sto-filter-table-actions>
 * </sto-filter-panel>
 * ```
 */
@Directive({
  selector: 'sto-filter-table-actions',
  host: { class: 'sto-filter-table-actions' },
})
export class StoFilterTableActions {}

/**
 * Directive for projecting filter action buttons into the filter panel header.
 * These actions appear on the right side of the header next to the expand button.
 *
 * @example
 * ```html
 * <sto-filter-panel>
 *   <sto-filter-actions>
 *     <button>Clear All</button>
 *   </sto-filter-actions>
 * </sto-filter-panel>
 * ```
 */
@Directive({ selector: 'sto-filter-actions' })
export class StoFilterActions {}

/**
 * Internal component that displays filter actions with an optional expand/collapse button.
 * This component is used internally by sto-filter-panel.
 * @internal
 */
@Component({
  selector: 'sto-filter-actions-bar',
  template: `
    <ng-content></ng-content>
    @if (expandable()) {
      <button
        matIconButton
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
  /**
   * Whether the expand/collapse button should be shown.
   */
  readonly expandable = input<boolean>();

  /**
   * Emits when the expand/collapse button is clicked.
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly toggle = output<void>();

  /**
   * Current expanded state of the parent panel.
   */
  readonly expanded = input(false, { transform: booleanAttribute });
}

/**
 * Sto filter panel is an extension of mat-accordion
 *
 * @breaking-change If you're using filter chips with FilterForm, you must now handle
 * the `(clearFilter)` output event explicitly in your template:
 * ```html
 * <sto-filter-panel
 *   [filterList]="filter$ | async"
 *   (clearFilter)="clearFilter($event.key, $event.index)">
 * ```
 * The legacy automatic binding through ViewContainerRef has been removed.
 */
@Component({
  selector: 'sto-filter-panel',
  templateUrl: './sto-filter-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './sto-filter-panel.component.scss',
  imports: [
    MatExpansionModule,
    MatChipListbox,
    MatChipOption,
    MatIcon,
    MatChipRemove,
    StoFilterActionsBar,
  ],
})
export class StoFilterPanelComponent {
  /**
   * Whether the filter panel should be expandable.
   * @default true
   */
  readonly expandable = input(true, { transform: booleanAttribute });

  /**
   * Whether the filter panel should be expanded by default.
   * @default true
   */
  readonly expanded = input(true);

  /**
   * List of active filters to display as chips in the header.
   */
  readonly filterList = input<FilterList[]>([]);

  /**
   * Emits when the panel is toggled.
   * @property isExpanded - True if the panel is expanded, false if collapsed
   * @property contentHeight - The height of the expanded content in pixels
   */
  readonly toggled = output<{
    isExpanded: boolean;
    contentHeight: number;
  }>();

  /**
   * Emits when a filter chip should be cleared.
   * @property key - The filter key to clear
   * @property index - Optional index of the filter to clear
   */
  readonly clearFilter = output<{ key: string; index?: number }>();

  readonly contentWrapper = viewChild<ElementRef<HTMLElement>>('tableActions');
  readonly filterActions = viewChild<ElementRef<HTMLElement>>('filterActions');
  readonly filterForm = viewChild<ElementRef<HTMLElement>>('filterForm');
  readonly panel = viewChild('panel', { read: MatExpansionPanel });

  /**
   * Current expanded state of the panel (internal).
   * Synced with the expanded input and Material panel state.
   * @internal
   */
  readonly _expanded = linkedSignal(() => this.expanded());

  /**
   * Cached content height for the toggled output.
   * @internal
   */
  private readonly contentHeight = signal(0);

  constructor() {
    // Auto-update content height when panel expands/collapses
    effect(() => {
      if (this._expanded()) {
        // Schedule update after DOM updates
        queueMicrotask(() => this.updateContentHeight());
      }
    });

    // Disable expansion if not expandable
    effect(() => {
      if (!this.expandable()) {
        this._expanded.set(false);
      }
    });
  }

  /**
   * Handles panel state changes from Material expansion panel events.
   * @param isExpanded - Whether the panel is now expanded
   * @internal
   */
  onPanelStateChange(isExpanded: boolean): void {
    if (isExpanded === this._expanded()) return;

    this._expanded.set(isExpanded);
    this.toggled.emit({
      isExpanded,
      contentHeight: this.contentHeight(),
    });
  }

  /**
   * Toggles the expansion state of the panel.
   * Called when clicking on the title or expand button.
   */
  toggle(): void {
    this.panel()?.toggle();
  }

  /**
   * Clears a filter chip from the list.
   * Emits the clearFilter output for the parent component to handle.
   * @param key - The filter key to clear
   * @param index - Optional index of the filter to clear
   * @internal
   */
  _clearFilter(key: string, index?: number): void {
    this.clearFilter.emit({ key, index });
  }

  private updateContentHeight(): void {
    const element = this.filterForm()?.nativeElement;
    if (element?.parentElement) {
      this.contentHeight.set(element.parentElement.offsetHeight);
    }
  }
}

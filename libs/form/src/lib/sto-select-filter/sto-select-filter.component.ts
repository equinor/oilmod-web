import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatPseudoCheckboxState } from '@angular/material/core';
import {
  MatFormField,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

/**
 * Component for filtering options in mat-select dropdowns with integrated select-all functionality.
 *
 * @example
 * ```typescript
 * public all = ["a", "b", "c"];
 * public filtered = all;
 *
 * public filter(val: string) {
 *   this.filtered = this.all.filter(x => x.includes(val));
 * }
 *
 * public selectAll(checked: boolean) {
 *   this.control.setValue(checked ? this.filtered : []);
 * }
 * ```
 *
 * ```html
 * <mat-select [formControl]="control" [multiple]="true">
 *   <sto-select-filter
 *     [isFilter]="true"
 *     [isMulti]="true"
 *     (valueChanges)="filter($event)"
 *     (selectAll)="selectAll($event)">
 *   </sto-select-filter>
 *   <mat-option *ngFor="let v of filtered" [value]="v">{{ v }}</mat-option>
 * </mat-select>
 * ```
 */

@Component({
  selector: 'sto-select-filter',
  templateUrl: './sto-select-filter.component.html',
  styleUrl: './sto-select-filter.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sto-select-filter',
  },
  imports: [
    MatFormField,
    MatPrefix,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatIcon,
    MatSuffix,
    MatCheckbox,
  ],
})
export class StoSelectFilterComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly select = inject(MatSelect);

  readonly inputElement =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');

  readonly inputControl = new FormControl<string>('');

  private readonly options = signal<unknown[]>([]);
  private readonly selectedValue = signal<unknown[]>([]);

  readonly checkboxState = computed<MatPseudoCheckboxState>(() => {
    if (!this.isMulti()) return 'unchecked';

    const selectedCount = this.selectedValue().filter((val) =>
      this.options().includes(val),
    ).length;
    const totalCount = this.options().length;

    if (selectedCount === totalCount && totalCount > 0) return 'checked';
    if (selectedCount > 0) return 'indeterminate';
    return 'unchecked';
  });

  /** Emits when the filter value changes */
  readonly valueChanges = output<string>();

  /** Emits when selectAll checkbox changes */
  readonly selectAll = output<boolean>();

  /** Determines if select all is available */
  readonly isMulti = input(true);

  /** Determines if filtering is active */
  readonly isFilter = input(true);

  /** Automatically focus input element if it's empty */
  readonly focusIfNoValue = input(true);

  /** Initial value of the filter */
  readonly value = input<unknown>();

  /** @deprecated This input is no longer used. The component calculates the total automatically from available options. */
  readonly total = input<number>();

  /** @deprecated This input is no longer used. The component calculates the selected count automatically from the form control value. */
  readonly selected = input<number>();

  constructor() {
    afterNextRender(() => {
      this.initializeSelectAllTracking();
    });

    // Sync value input to filter control
    effect(() => {
      const val = this.value();
      if (val !== undefined && val !== this.inputControl.value) {
        this.inputControl.setValue(val as string, { emitEvent: false });
      }
    });

    // Focus input when select opens
    this.select.openedChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open) => {
        if (open && this.focusIfNoValue() && this.isMulti()) {
          requestAnimationFrame(() => {
            this.inputElement()?.nativeElement.focus();
          });
        }
      });

    // Emit filter changes
    this.inputControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.valueChanges.emit(value ?? '');
      });
  }

  onSelectAllClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const control = this.select?.ngControl?.control;
    if (!control) return;

    const currentState = this.checkboxState();
    if (currentState === 'checked' || currentState === 'indeterminate') {
      control.setValue([]);
      this.selectAll.emit(false);
    } else {
      control.setValue(this.options());
      this.selectAll.emit(true);
    }
  }

  private initializeSelectAllTracking(): void {
    if (!this.isMulti() || !this.select?.ngControl?.control) {
      return;
    }

    // Set initial value from form control
    this.selectedValue.set(this.select.ngControl.control.value ?? []);

    // Track value changes
    this.select.ngControl.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        this.selectedValue.set(newValue ?? []);
      });

    // Initialize options after a brief delay to ensure they're rendered
    setTimeout(() => {
      this.updateOptions();
    });

    // Track option changes
    this.select.options?.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateOptions());
  }

  private updateOptions(): void {
    const optionValues = this.select?.options?.map((x) => x.value) ?? [];
    this.options.set(optionValues);
  }

  /** Clears the filter input */
  clear(): void {
    this.inputControl.reset('');
  }
}

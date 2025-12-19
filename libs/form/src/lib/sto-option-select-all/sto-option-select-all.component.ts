import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  NgModule,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxState } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'sto-option-select-all',
  templateUrl: './sto-option-select-all.component.html',
  styleUrl: './sto-option-select-all.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule],
  host: {
    class: 'mat-option',
  },
})
export class StoOptionSelectAllComponent<T = unknown> {
  private readonly matSelect = inject(MatSelect, {
    host: true,
    optional: true,
  });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Optional MatSelect instance to use instead of injecting from host */
  readonly matSelectInstance = input<MatSelect | null>(null);

  private readonly options = signal<T[]>([]);
  private readonly value = signal<T[]>([]);

  /** Emits true when all options are selected, false otherwise */
  readonly selectionChange = output<boolean>();

  readonly state = computed<MatPseudoCheckboxState>(() => {
    const currentValue = this.value();
    const allOptions = this.options();

    if (this.areArraysEqual(currentValue, allOptions)) {
      return 'checked';
    }
    return currentValue.length > 0 ? 'indeterminate' : 'unchecked';
  });

  constructor() {
    afterNextRender(() => {
      this.initializeComponent();
    });
  }

  @HostListener('click', ['$event'])
  onSelectAllClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const select = this.matSelectInstance() ?? this.matSelect;
    const control = select?.ngControl?.control;
    if (!control) return;

    const currentState = this.state();
    if (currentState === 'checked' || currentState === 'indeterminate') {
      control.setValue([]);
    } else {
      control.setValue(this.options());
    }
  }

  private initializeComponent() {
    const select = this.matSelectInstance() ?? this.matSelect;
    if (!select?.ngControl?.control) {
      this.el.nativeElement.style.display = 'none';
      return;
    }

    // Set initial value from form control
    this.value.set(select.ngControl.control.value ?? []);

    // Track value changes
    select.ngControl.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        this.value.set(newValue ?? []);

        // Emit selection state change
        const allSelected = this.areArraysEqual(newValue ?? [], this.options());
        this.selectionChange.emit(allSelected);
      });

    // Initialize options after a brief delay to ensure they're rendered
    setTimeout(() => {
      this.updateOptions();
    });

    // Track option changes
    select.options?.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateOptions());
  }

  private updateOptions() {
    const select = this.matSelectInstance() ?? this.matSelect;
    const optionValues = select?.options?.map((x) => x.value) ?? [];
    this.options.set(optionValues);
  }

  private areArraysEqual(a: T[], b: T[]): boolean {
    if (!a || !b || a.length !== b.length) {
      return false;
    }
    return [...a].sort().join(',') === [...b].sort().join(',');
  }
}

/**
 * @deprecated Use StoOptionSelectAllComponent directly instead.
 */


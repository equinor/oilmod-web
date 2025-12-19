import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { DateRange, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { HIDE_FORM_FIELD_TITLE } from './token';

@Directive({
  selector: 'mat-form-field[stoFormField]',
  exportAs: 'stoFormField',
  standalone: true,
  host: {
    '[title]':
      '(hideFormFieldTitle || disableFormFieldTitle()) ? null : displayTitle()',
    class: 'sto-form__field',
    '[class.sto-form__field--readonly]': 'isFieldReadOnly()',
    '[class.sto-form__field--disabled]': 'isFieldDisabled()',
    '[attr.data-cy]': 'fieldName()',
  },
})
export class FormFieldDirective {
  protected readonly hideFormFieldTitle = inject(HIDE_FORM_FIELD_TITLE, {
    optional: true,
  });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly inputs = contentChildren(MatFormFieldControl);
  readonly disableFormFieldTitle = input<boolean>();
  readonly title = input<string>('');

  private readonly firstControl = computed(() => this.inputs()[0]);
  private readonly computedTitle = signal<string>('');
  readonly displayTitle = computed(() => this.title() || this.computedTitle());

  // Reactive state that updates when control state changes
  private readonly _isFieldReadOnly = signal(false);
  private readonly _isFieldDisabled = signal(false);
  private readonly _fieldName = signal<string | null>(null);

  readonly isFieldReadOnly = this._isFieldReadOnly.asReadonly();
  readonly isFieldDisabled = this._isFieldDisabled.asReadonly();
  readonly fieldName = this._fieldName.asReadonly();

  constructor() {
    // React to input control changes and subscribe to stateChanges
    effect((onCleanup) => {
      const control = this.firstControl();

      if (!control) {
        this._isFieldReadOnly.set(false);
        this._isFieldDisabled.set(false);
        this._fieldName.set(null);
        return;
      }

      // Update initial state
      this._isFieldReadOnly.set(this.isReadOnly(control));
      this._isFieldDisabled.set(control.disabled ?? false);
      this._fieldName.set(this.getInputName(control));

      // Subscribe to state changes to keep signals updated
      const subscription = control.stateChanges.subscribe(() => {
        untracked(() => {
          this._isFieldReadOnly.set(this.isReadOnly(control));
          this._isFieldDisabled.set(control.disabled ?? false);
        });
      });

      // Handle autocomplete
      if (control instanceof MatInput) {
        this.setAutocompleteOff(control);
      }

      // Update title
      if (!this.hideFormFieldTitle && !this.disableFormFieldTitle()) {
        this.updateTitle(control);
      }

      // Cleanup subscription when effect re-runs or is destroyed
      onCleanup(() => subscription.unsubscribe());
    });
  }

  private updateTitle(control: MatFormFieldControl<unknown>): void {
    if (control instanceof MatSelect) {
      this.computedTitle.set(control.triggerValue);
    } else if (control instanceof MatDateRangeInput) {
      const value = control.value as DateRange<Date>;
      if (!value) {
        this.computedTitle.set('');
        return;
      }
      const formattedRange = Object.values(value)
        .filter((v) => !!v)
        .map((dateValue) => this.formatDate(dateValue))
        .join(' - ');
      this.computedTitle.set(formattedRange);
    } else {
      this.computedTitle.set(this.formatValue(control.value));
    }
  }

  private getInputName(control: MatFormFieldControl<unknown>): string | null {
    try {
      let name = (control.ngControl as NgControl)?.name;
      // Fallback to using the name attribute
      if (!name && 'name' in control) {
        name = (control as MatInput).name;
      }
      return typeof name === 'string' ? name : null;
    } catch {
      return null;
    }
  }

  private isReadOnly(control: MatFormFieldControl<unknown>): boolean {
    if (control instanceof MatInput) {
      return control.readonly;
    }
    return (
      (control as MatFormFieldControl<unknown> & { readonly?: boolean })
        .readonly || false
    );
  }

  private setAutocompleteOff(input: MatInput): void {
    try {
      // Access the native input element safely
      const nativeElement = (
        input as unknown as { _elementRef?: ElementRef<HTMLInputElement> }
      )._elementRef?.nativeElement;
      if (nativeElement) {
        nativeElement.autocomplete = 'off';
      }
    } catch {
      // Silently fail if unable to access private property
    }
  }

  private formatDate(value: unknown): string {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const day = `${value.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return String(value);
  }

  private formatValue(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else if (value instanceof Date) {
      return this.formatDate(value);
    }
    return '';
  }

  @HostListener('click')
  @HostListener('dblclick')
  onClick(): void {
    const control = this.firstControl();
    if (!(control instanceof MatInput)) {
      return;
    }

    const nativeElement = (
      control as unknown as { _elementRef?: ElementRef<HTMLInputElement> }
    )._elementRef?.nativeElement;
    if (!nativeElement || nativeElement.readOnly || nativeElement.disabled) {
      return;
    }

    const isTextarea = nativeElement.tagName.toLowerCase() === 'textarea';
    if (!isTextarea) {
      nativeElement.focus();
      nativeElement.select();
    }
  }
}

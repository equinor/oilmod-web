import {
  afterNextRender,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
} from '@angular/core';
import { NumberInputPipe } from './number-input.pipe';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[numberInput]',
  standalone: true,
  providers: [NumberInputPipe],
})
export class NumberInputDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly injector = inject(Injector);
  private readonly numberFormatPipe = inject(NumberInputPipe);

  readonly unit = input<string>();
  readonly appendUnit = input<boolean>();
  readonly fractionSize = input(5);
  readonly dynamicFractionSize = input<boolean>();

  private readonly el = this.elementRef.nativeElement;

  public setDisplayValue(readonly: boolean) {
    const val = (this.el.value || '').replace(` ${this.unit()}`, '');
    const unit = this.unit();
    if (unit) {
      if (readonly) {
        this.el.value = val + ` ${unit}`;
      } else {
        this.el.value = val;
      }
    }
  }

  /**
   * Listens for the paste events.
   * Handles spaces, long dash, period and commas.
   * Tries to the format, will be ignored if something fails.
   * @param e event
   * @param clipboardData
   */
  @HostListener('paste', ['$event', '$event.clipboardData'])
  onPaste(e: Event, clipboardData: DataTransfer | null) {
    if (this.el.readOnly || this.el.disabled || !clipboardData) {
      return;
    }
    e.preventDefault();
    let pasted = clipboardData.getData('text') || '';
    pasted = pasted.replace('—', '-'); // long dash, sometime used in Excel and Word
    pasted = this.handleMixedCommasAndDecimals(pasted);
    let parsedValue = this.numberFormatPipe.parse(
      pasted,
      this.fractionSize(),
      this.dynamicFractionSize(),
    );

    if (!this.hasInvalidValues(parsedValue)) {
      parsedValue = parsedValue.replace('.', ',');
      this.el.value = parsedValue;
      this.el.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Listen for key event to work like a number field.
   * Transforms period to comma.
   * Handles hash, allows copy,pase,cut and select all.
   * @param e
   */
  @HostListener('keydown', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    if (this.el.readOnly || this.el.disabled) {
      return;
    }
    if (e.key === 'Enter') {
      this.el.blur();
    }
    if (this.isNumberKeypress(e)) {
      // Valid number input - allow it
      return;
    } else if (['.', ','].includes(e.key)) {
      this.handlePeriodDelimiter(e);
    } else if (['-'].includes(e.key)) {
      this.handleDash(e);
    } else if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      this.handleKeyUpAndDown(e);
    } else if (this.isNavigationKey(e)) {
      // Navigation keys - allow them
      return;
    } else if (this.isCopyPaste(e) || this.isCtrlA(e)) {
      // Clipboard operations - allow them
      return;
    } else {
      e.preventDefault();
    }
  }

  @HostListener('focus', ['$event'])
  onFocus($event: FocusEvent) {
    if (this.el.readOnly || this.el.disabled) {
      return;
    }
    const target = $event.target as HTMLInputElement;
    const value = target.value;
    this.el.value = (
      this.numberFormatPipe.parse(
        value,
        this.fractionSize(),
        this.dynamicFractionSize(),
      ) + ''
    ).replace('.', ',');
    this.el.select();
  }

  @HostListener('blur')
  onBlur() {
    if (this.el.readOnly || this.el.disabled) {
      return;
    }
    this.el.value = this.numberFormatPipe.transform(
      this.el.value,
      this.fractionSize(),
      this.dynamicFractionSize(),
    );
  }

  /**
   *  Handles thousand seperator with commas
   * @param orgStr eg. 123.214,123
   * {string} 123214.123
   */
  private handleMixedCommasAndDecimals(orgStr: string) {
    let str = orgStr + '';
    str = str.replace(',', '.');
    const array = str.split('.');
    if (array.length > 1) {
      const prefix = array.slice(0, array.length - 1).join('');
      str = prefix + '.' + array[array.length - 1];
    } else {
      str = orgStr;
    }
    return str;
  }

  /**
   * Se if parsed string contains words that indicate a failed parse.
   * @param parsedValue
   * {boolean}
   */
  private hasInvalidValues(parsedValue: string) {
    return (
      parsedValue.includes('NaN') ||
      parsedValue.includes('undefined') ||
      parsedValue.includes('null')
    );
  }

  /**
   * Handles dash. Is ignored if already exist a comma.
   * Replaces period with comma.
   * @param e
   */
  private handlePeriodDelimiter(e: KeyboardEvent) {
    let selectionIncludesPeriod = false;
    if (!e.target) {
      return;
    }
    const target = e.target as HTMLInputElement;
    if (
      target.selectionStart !== null &&
      target.selectionEnd !== null &&
      target.selectionStart !== target.selectionEnd &&
      this.el.value &&
      this.el.value.length > 0
    ) {
      const selection = this.el.value.substring(
        target.selectionStart,
        target.selectionEnd,
      );
      selectionIncludesPeriod = selection.includes(',');
    }

    if (this.el.value.includes(',') && !selectionIncludesPeriod) {
      e.preventDefault();
    } else if (e.key === '.') {
      afterNextRender(
        () => {
          const target = e.target as HTMLInputElement;
          const caretPosition = target.selectionStart;
          this.el.value = this.el.value.replace('.', ',');
          if (caretPosition !== null) {
            this.el.setSelectionRange(caretPosition, caretPosition);
          }
        },
        { injector: this.injector },
      );
    }
  }

  /**
   * All text is selected in the input
   * @param e
   * {boolean}
   */
  private hasSelectedAllText(e: KeyboardEvent): boolean {
    const target = e.target as HTMLInputElement;
    if (
      !target ||
      target.selectionStart === null ||
      target.selectionEnd === null
    ) {
      return false;
    }
    return target.selectionEnd - target.selectionStart === this.el.value.length;
  }

  /**
   * Handles dashes. Should only be allowed in the beginning and only once.
   * @param e
   */
  private handleDash(e: KeyboardEvent) {
    if (!e.target) {
      return;
    }
    const target = e.target as HTMLInputElement;
    // Allow dash if all text is selected or if cursor is at start and no dash exists
    if (
      this.hasSelectedAllText(e) ||
      (!this.el.value.includes('-') && target.selectionStart === 0)
    ) {
      return;
    }
    e.preventDefault();
  }

  /**
   * Is copy, paste or cut.
   * @param e
   * {boolean}
   */
  private isCopyPaste(e: KeyboardEvent): boolean {
    return (
      (e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())
    );
  }

  /**
   * Is select all text (CTRL+A)
   * @param e
   * {boolean}
   */
  private isCtrlA(e: KeyboardEvent): boolean {
    return (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a';
  }

  /**
   * Is a number, on keyboard and on numpad.
   * @param e
   * {boolean}
   */
  private isNumberKeypress(e: KeyboardEvent): boolean {
    return /^[0-9]$/.test(e.key);
  }

  /**
   * Is a navigation or editing key (arrows, backspace, delete, etc.)
   * @param e
   */
  private isNavigationKey(e: KeyboardEvent): boolean {
    const navKeys = [
      'Backspace',
      'Delete',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    return navKeys.includes(e.key);
  }

  /**
   * Handles up and down arrows by adding/subtracting one
   * @param e
   */
  private handleKeyUpAndDown(e: KeyboardEvent) {
    if (this.el.readOnly || this.el.disabled) {
      return;
    }
    const value = this.el.value;
    const addition = e.key === 'ArrowUp' ? 1 : -1;
    let [integerSplit = '', fractionSplit = ''] = (value || '').split(',');
    integerSplit = integerSplit.replace(' ', '');
    if (integerSplit.length === 0) {
      integerSplit = '0';
    }
    const currentValue = parseInt(integerSplit, 10);

    afterNextRender(
      () => {
        if (fractionSplit.length > 0) {
          this.el.value = currentValue + addition + ',' + fractionSplit;
        } else {
          this.el.value = currentValue + addition + '';
        }
        this.el.dispatchEvent(new Event('input'));
      },
      { injector: this.injector },
    );
  }
}

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Key } from '@ngx-stoui/core';
import { StoNumberInputPipe } from './sto-number-input.pipe';


@Directive({ selector: '[numberInput]' })
export class StoNumberInputDirective {

  private _el: HTMLInputElement;

  @Input() fractionSize = 5;
  private _hasSelectAllEnabled = true;
  @Input() set hasSelectAllEnabled(hasSelectAllEnabled: boolean) {
    this._hasSelectAllEnabled = hasSelectAllEnabled;
  }

  get hasSelectAllEnabled(): boolean {
    return this._hasSelectAllEnabled;
  }

  /**
   * List of keys ignored, to work as default.
   *  {Key[]}
   */
  private ignoredKeys = [
        Key.Dash,
        Key.Backspace,
        Key.Delete,
        Key.Home,
        Key.LeftArrow,
        Key.RightArrow,
        Key.End,
        Key.Tab,
        Key.Subtract
    ];

    /**
     * Listens for the paste events.
     * Handles spaces, long dash, period and commas.
     * Tries to the format, will be ignored if something fails.
     * @param e event
     */
    @HostListener('paste', ['$event'])
    onPaste(e) {
        if (this._el.readOnly || this._el.disabled) {
            return;
        }
        e.preventDefault();
        let pasted = e.clipboardData.getData('text') || '';
        pasted = pasted.replace('—', '-'); //long dash, sometime used in Excel and Word
        pasted = this.handleMixedCommasAndDecimals(pasted);
        let parsedValue = this.numberFormatPipe.parse(pasted, this.fractionSize);

        if (!this.hasInvalidValues(parsedValue)) {

            parsedValue = parsedValue.replace('.', ',');
            this._el.value = parsedValue;
            this._el.dispatchEvent(new Event('input'));
        }
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
        return parsedValue.includes('NaN')
            || parsedValue.includes('undefined')
            || parsedValue.includes('null');
    }

    /**
     * Listen for key event to work like a number field.
     * Transforms period to comma.
     * Handles hash, allows copy,pase,cut and select all.
     * @param e
     */
    @HostListener('keydown', ['$event'])
    onKeyPress(e) {
        if (this._el.readOnly || this._el.disabled) {
            return;
        }
        if ([Key.Enter].includes(e.which)) {
          this._el.blur();
        }
        if (this.isNumberKeypress(e)) {

        } else if ([Key.Period, Key.Comma, Key.DecimalPoint].includes(e.which)) {
            this.handlePeriodDelimiter(e);
        } else if ([Key.Dash, Key.Subtract].includes(e.which)) {
            this.handleDash(e);
        } else if ([Key.UpArrow, Key.DownArrow].includes(e.which)) {
            this.handleKeyUpAndDown(e);
        } else if (this.ignoredKeys.indexOf(e.which) !== -1) {
        } else if (this.isCopyPaste(e) || this.isCtrlA(e)) {
        } else {
            e.preventDefault();
        }
    }

    /**
     * Handles dash. Is ignored if already exist a comma.
     * Replaces period with comma.
     * @param e
     */
    private handlePeriodDelimiter(e) {
        let selectionIncludesPeriod = false;
        if (e.target.selectionStart !== e.target.selectionEnd && this._el.value && this._el.value.length > 0) {
          const selection = this._el.value.substring(e.target.selectionStart, e.target.selectionEnd);
          selectionIncludesPeriod = selection.includes(',');
        }

        if (this._el.value.includes(',') && !selectionIncludesPeriod) {
            e.preventDefault();
        } else if (e.which === Key.Period) {
            setTimeout(() => {
                const caretPosition = e.target.selectionStart;
                this._el.value = this._el.value.replace('.', ',');
                this._el.setSelectionRange(caretPosition, caretPosition);

            }, 0);
        }
    }

    /**
     * All text is selected in the input
     * @param e
     * {boolean}
     */
    private hasSelectedAllText(e) {
        return e.target.selectionEnd - e.target.selectionStart === this._el.value.length;

    }

    /**
     * Handles dashes. Should only be allowed in the beginning and only once.
     * @param e
     */
    private handleDash(e) {
        if (this.hasSelectedAllText(e)) {
        } else if (!this._el.value.includes('-') && e.target.selectionStart === 0) {
        } else {
            e.preventDefault();
        }
    }

    /**
     * Is copy, paste or cut.
     * @param e
     * {boolean}
     */
    private isCopyPaste(e) {
        return e.ctrlKey && (e.which === Key.C || e.which === Key.V || e.which === Key.X);
    }

    /**
     * Is select all text (CTRL+A)
     * @param e
     * {boolean}
     */
    private isCtrlA(e) {
        return e.ctrlKey && (e.which === Key.A);
    }

    /**
     * Is a number, on keyboard and on numpad.
     * @param e
     * {boolean}
     */
    private isNumberKeypress(e) {
        return (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
    }


    /**
     * Handles up and down arrows by adding/subtracting one
     * @param e
     */
    private handleKeyUpAndDown(e) {
        if (this._el.readOnly || this._el.disabled) {
            return;
        }
        const value = this._el.value;
        const addition = e.which  === Key.UpArrow ? 1 : -1;
        let [integerSplit = '', fractionSplit = ''] = (value || '').split(',');
        integerSplit = integerSplit.replace(' ', '');
        if (integerSplit.length === 0) {
            integerSplit = '0';
        }
        const currentValue = parseInt(integerSplit, 10);

        setTimeout(() => {
            if (fractionSplit.length > 0) {
                this._el.value = ((currentValue + addition) + ',' + fractionSplit);
            } else {
                this._el.value = (currentValue + addition) + '';
            }
            this._el.dispatchEvent(new Event('input'));
        }, 0);

    }

    @HostListener('focus', ['$event'])
    onFocus($event) {
        if (this._el.readOnly || this._el.disabled) {
            return;
        }
        const value = $event.target.value;
        this._el.value = (this.numberFormatPipe.parse(value, this.fractionSize) + '').replace('.', ',');
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value) {
        if (this._el.readOnly || this._el.disabled) {
            return;
        }
        this._el.value = this.numberFormatPipe.transform(value, this.fractionSize);
    }


    constructor(private elementRef: ElementRef,
                private numberFormatPipe: StoNumberInputPipe,
    ) {
        this._el = this.elementRef.nativeElement;
    }
}

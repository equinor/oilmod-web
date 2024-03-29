/* eslint-disable no-empty */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Key } from '@ngx-stoui/core';
import { NumberInputPipe } from './number-input.pipe';


@Directive({
// eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[numberInput]',
  standalone: true
})
export class NumberInputDirective {
  @Input()
  unit: string | undefined;
  @Input()
  appendUnit: boolean;
  @Input()
  fractionSize = 5;
  @Input()
  dynamicFractionSize: boolean;
  private _el: HTMLInputElement;
  private numberFormatPipe = new NumberInputPipe();
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


  constructor(private elementRef: ElementRef
  ) {
    this._el = this.elementRef.nativeElement;
  }

  public setDisplayValue(readonly: boolean) {
    const val = ( this._el.value || '' ).replace(` ${this.unit}`, '');
    if ( this.unit ) {
      if ( readonly ) {
        this._el.value = val + ` ${this.unit}`;
      } else {
        this._el.value = val;
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
  @HostListener('paste', [ '$event', '$event.clipboardData' ])
  onPaste(e: Event, clipboardData: DataTransfer | null) {
    if ( this._el.readOnly || this._el.disabled || !clipboardData ) {
      return;
    }
    e.preventDefault();
    let pasted = clipboardData.getData('text') || '';
    pasted = pasted.replace('—', '-'); // long dash, sometime used in Excel and Word
    pasted = this.handleMixedCommasAndDecimals(pasted);
    let parsedValue = this.numberFormatPipe.parse(pasted, this.fractionSize, this.dynamicFractionSize);

    if ( !this.hasInvalidValues(parsedValue) ) {

      parsedValue = parsedValue.replace('.', ',');
      this._el.value = parsedValue;
      this._el.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Listen for key event to work like a number field.
   * Transforms period to comma.
   * Handles hash, allows copy,pase,cut and select all.
   * @param e
   */
  @HostListener('keydown', [ '$event' ])
  onKeyPress(e: KeyboardEvent) {
    if ( this._el.readOnly || this._el.disabled ) {
      return;
    }
    if ( [ Key.Enter ].includes(e.which) ) {
      this._el.blur();
    }
    if ( this.isNumberKeypress(e) ) {
      // do nothing
    } else if ( [ Key.Period, Key.Comma, Key.DecimalPoint ].includes(e.which) ) {
      this.handlePeriodDelimiter(e);
    } else if ( [ Key.Dash, Key.Subtract ].includes(e.which) ) {
      this.handleDash(e);
    } else if ( [ Key.UpArrow, Key.DownArrow ].includes(e.which) ) {
      this.handleKeyUpAndDown(e);
    } else if ( this.ignoredKeys.indexOf(e.which) !== -1 ) {
    } else if ( this.isCopyPaste(e) || this.isCtrlA(e) ) {
    } else {
      e.preventDefault();
    }
  }

  @HostListener('focus', [ '$event' ])
  onFocus($event: FocusEvent) {
    if ( this._el.readOnly || this._el.disabled ) {
      return;
    }
    const target = $event.target as HTMLInputElement;
    const value = target.value;
    this._el.value = ( this.numberFormatPipe.parse(value, this.fractionSize, this.dynamicFractionSize) + '' ).replace('.', ',');
    this._el.select();
  }

  @HostListener('blur', [ '$event.target.value' ])
  onBlur(value: number) {
    if ( this._el.readOnly || this._el.disabled ) {
      return;
    }
    this._el.value = this.numberFormatPipe.transform(value, this.fractionSize, this.dynamicFractionSize);
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
    if ( array.length > 1 ) {
      const prefix = array.slice(0, array.length - 1).join('');
      str = prefix + '.' + array[ array.length - 1 ];
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
   * Handles dash. Is ignored if already exist a comma.
   * Replaces period with comma.
   * @param e
   */
  private handlePeriodDelimiter(e: KeyboardEvent) {
    let selectionIncludesPeriod = false;
    if ( !e.target ) {
      return;
    }
    const target = e.target as HTMLInputElement;
    if ( target.selectionStart !== target.selectionEnd && this._el.value && this._el.value.length > 0 ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const selection = this._el.value.substring(target.selectionStart, target.selectionEnd);
      selectionIncludesPeriod = selection.includes(',');
    }

    if ( this._el.value.includes(',') && !selectionIncludesPeriod ) {
      e.preventDefault();
    } else if ( e.which === Key.Period ) {
      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        const caretPosition = target.selectionStart;
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
  private hasSelectedAllText(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    if ( !target ) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return target.selectionEnd - target.selectionStart === this._el.value.length;

  }

  /**
   * Handles dashes. Should only be allowed in the beginning and only once.
   * @param e
   */
  private handleDash(e: KeyboardEvent) {
    if ( !e.target ) {
      return;
    }
    if ( this.hasSelectedAllText(e) ) {
    } else if ( !this._el.value.includes('-') && ( e.target as HTMLInputElement ).selectionStart === 0 ) {
    } else {
      e.preventDefault();
    }
  }

  /**
   * Is copy, paste or cut.
   * @param e
   * {boolean}
   */
  private isCopyPaste(e: KeyboardEvent) {
    return ( e.ctrlKey || e.metaKey ) && ( e.which === Key.C || e.which === Key.V || e.which === Key.X );
  }

  /**
   * Is select all text (CTRL+A)
   * @param e
   * {boolean}
   */
  private isCtrlA(e: KeyboardEvent) {
    return ( e.ctrlKey || e.metaKey ) && ( e.which === Key.A );
  }

  /**
   * Is a number, on keyboard and on numpad.
   * @param e
   * {boolean}
   */
  private isNumberKeypress(e: KeyboardEvent) {
    return ( e.keyCode >= 48 && e.keyCode <= 57 ) || ( e.keyCode >= 96 && e.keyCode <= 105 );
  }

  /**
   * Handles up and down arrows by adding/subtracting one
   * @param e
   */
  private handleKeyUpAndDown(e: KeyboardEvent) {
    if ( this._el.readOnly || this._el.disabled ) {
      return;
    }
    const value = this._el.value;
    const addition = e.which === Key.UpArrow ? 1 : -1;
    // eslint-disable-next-line prefer-const
    let [ integerSplit = '', fractionSplit = '' ] = ( value || '' ).split(',');
    integerSplit = integerSplit.replace(' ', '');
    if ( integerSplit.length === 0 ) {
      integerSplit = '0';
    }
    const currentValue = parseInt(integerSplit, 10);

    setTimeout(() => {
      if ( fractionSplit.length > 0 ) {
        this._el.value = ( ( currentValue + addition ) + ',' + fractionSplit );
      } else {
        this._el.value = ( currentValue + addition ) + '';
      }
      this._el.dispatchEvent(new Event('input'));
    }, 0);

  }

}

import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * stoSelectTextOnFocus listens for input focus events, and selects the contents of the input
 * A user service is established in {@link StoUserPreferenceService} that allows a user to toggle this feature
 */
@Directive({
  selector: '[stoSelectTextOnFocus]',
  standalone: true
})
export class StoSelectTextOnFocusDirective {
  private elementRef = inject(ElementRef);


  private _el: HTMLInputElement;

  constructor() {
    this._el = this.elementRef.nativeElement;
  }

  /**
   * Listens for focus events on the host (input) element, and focuses if applicable
   */
  @HostListener('focus')
  @HostListener('dblclick')
  onFocus() {
    if ( !this._el.readOnly ) {
      this._el.select();
    }

  }

}

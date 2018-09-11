import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { StoUserPreferenceService } from '../sto-user-preference/sto-user-preference.service';

/**
 * stoSelectTextOnFocus listens for input focus events, and selects the contents of the input
 * A user service is established in {@link StoUserPreferenceService} that allows a user to toggle this feature
 */
@Directive({
  selector: '[stoSelectTextOnFocus]'
})
export class StoSelectTextOnFocusDirective implements OnInit, OnDestroy{

  private destroyed$ = new Subject<boolean>();

  private _hasSelectTextOnFocusEnabled: boolean;
  private _el: HTMLInputElement;

  /**
   * Listens for focus events on the host (input) element, and focuses if applicable
   */
  @HostListener('focus')
  @HostListener('dblclick')
  onFocus() {
    if(this._hasSelectTextOnFocusEnabled && this._el.readOnly === false){
      this._el.setSelectionRange(0, this._el.value.length);
    }
  }

  constructor(private elementRef: ElementRef, private userPreferenceService : StoUserPreferenceService) {
    this._el = this.elementRef.nativeElement;
  }

  /**
   * Subscribes to changes in {@link StoUserPreferenceService}, and binds the variable accordingly.
   */
  ngOnInit(){
    this.userPreferenceService.hasSelectTextOnFocusEnabled
      .takeUntil(this.destroyed$)
      .subscribe((hasSelectTextOnFocusEnabled) => {
        this._hasSelectTextOnFocusEnabled = hasSelectTextOnFocusEnabled;
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

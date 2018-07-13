import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { StoUserPreferenceModule } from '../sto-user-preference/sto-user-preference.module';
import { Subject } from 'rxjs/Subject';
import { StoUserPreferenceService } from '../sto-user-preference/sto-user-preference.service';

@Directive({
  selector: '[stoSelectTextOnFocus]'
})
export class StoSelectTextOnFocusDirective implements OnInit, OnDestroy{

  private destroyed$ = new Subject<boolean>();

  private _hasSelectTextOnFocusEnabled: boolean;
  private _el: HTMLInputElement;

  @HostListener('focus')
  onFocus() {
    if(this._hasSelectTextOnFocusEnabled && this._el.readOnly === false){
      this._el.setSelectionRange(0, this._el.value.length);
    }

  }

  constructor(private elementRef: ElementRef, private userPreferenceService : StoUserPreferenceService) {
    this._el = this.elementRef.nativeElement;
  }

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

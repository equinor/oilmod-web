import { Directive, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatSelect } from '@angular/material';
import {  OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

/**
 * This is a menu that adds a style to the backdrop that allow click events to go through.
 * Because the close event is on the backdrop, we add a listener this feature.
 * Case: GLI-593
 */
@Directive({
  selector: '[stoIgnoreMenuBackdrop]'
})
export class StoIgnoreMenuBackdropDirective implements OnInit, OnDestroy {

  private destroyed$ = new Subject();
  private _matSelect: MatSelect;
  private _overlayRef: OverlayRef;

  private closeMenu = (event) => {
  const target = this._overlayRef.overlayElement;
    if(!target.contains((<any>event.target))){
      this._matSelect.close();
    }
  };

  ngOnInit(): void {
    try {
      this._matSelect = (<any>this._view)._data.componentView.component;
      this._matSelect.openedChange
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe((isOpen) => {
        this._overlayRef = this._matSelect.overlayDir.overlayRef;
        this._overlayRef.backdropElement.style.pointerEvents = 'none';
        if (isOpen) {
          document.addEventListener('mousedown', this.closeMenu);
        } else {
          document.removeEventListener('mousedown',  this.closeMenu);
        }
      });

    } catch (e) {
      console.error('This StoSelectDirective was build on undocumented features, and now it has failed. Remove or' +
        ' fix the directive.', e);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  constructor(private _view: ViewContainerRef) {

  }

}

import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { MatSelect } from '@angular/material';
import {  OverlayRef } from '@angular/cdk/overlay';

@Directive({
  selector: '[stoIgnoreMenuBackdrop]'
})
export class StoIgnoreMenuBackdropDirective implements OnInit {



  private _matSelect: MatSelect;
  private _overlayRef: OverlayRef;

  private closeMenu = (e) => {
  const target = this._overlayRef.overlayElement;
    if(!target.contains((<any>event.target))){
      this._matSelect.close();
    }
  };

  ngOnInit(): void {
    try {
      this._matSelect = (<any>this._view)._data.componentView.component;
      this._matSelect.openedChange.subscribe((isOpen) => {
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

  constructor(private _view: ViewContainerRef) {

  }

}

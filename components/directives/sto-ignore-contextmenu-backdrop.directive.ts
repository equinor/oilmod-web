import { Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

/**
 * This is a menu that adds a style to the backdrop that allow click events to go through.
 * Because the close event is on the backdrop, we add a listener this feature.
 * Case: GLI-593
 */
@Directive({
  selector: '[stoIgnoreContextmenuBackdrop]'
})
export class StoIgnoreContextmenuBackdropDirective implements OnInit, OnDestroy {

  @Input('stoIgnoreContextmenuBackdrop') _matMenuTrigger: MatMenuTrigger;

  private _matMenu: MatMenuPanel;
  private destroyed$ = new Subject();

  private closeMenu = (event) => {
    const path = event.path || [];
    const isClickOutside = !path.find(el => {
      if (!el.classList) {
        return false;
      } else {
        return el.classList.contains('cdk-overlay-pane');
      }
    });
    if (isClickOutside) {
      this._matMenuTrigger.closeMenu();
    }
  };

  ngOnInit(): void {
    try {

      this._matMenu = this._matMenuTrigger.menu;

      this._matMenuTrigger.menuOpened
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe(() => {
        const _overlay = (<any>this._matMenuTrigger)._overlayRef.backdropElement;
        if (_overlay) {
          _overlay.style.pointerEvents = 'none';
        }

        setTimeout(() => { // The trigger from code is set in a setTimeout so this has to be as well.
          document.addEventListener('mousedown', this.closeMenu);
        });
      });

      this._matMenuTrigger.menuClosed
        .pipe(
          takeUntil(this.destroyed$)
        ).subscribe(() => {
        document.removeEventListener('mousedown', this.closeMenu);
      });

    } catch (e) {
      console.error('This directive was build on undocumented features and uses private methods.and now it has' +
        ' failed. Make sure triggerName is correct or remove the directive', e);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  constructor(private _view: ViewContainerRef) {

  }

}

import { Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This is a menu that adds a style to the backdrop that allow click events to go through.
 * Because the close event is on the backdrop, we add a listener this feature.
 * Case: GLI-593
 */
@Directive({
  selector: '[stoIgnoreContextmenuBackdrop]'
})
export class StoIgnoreContextmenuBackdropDirective implements OnInit, OnDestroy {

  /**
   * stoIgnoreContextmenuBackdrop (binds to _matMenuTrigger) gives us access to the trigger for the menu item
   * This is required to allow us to programmatically manipulate the menu state
   */
  @Input('stoIgnoreContextmenuBackdrop') _matMenuTrigger: MatMenuTrigger;

  private _matMenu: MatMenuPanel;
  private destroyed$ = new Subject();

  /**
   * closeMenu finds the relevant overlay, and if the click event is outside the menu, it gets closed.
   * @param event
   */
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
  }

  ngOnInit(): void {
    try {

      this._matMenu = this._matMenuTrigger.menu;

      this.listenToMenuOpen();
      this.listenToMenuClose();

    } catch (e) {
      console.error('This directive was build on undocumented features and uses private methods.and now it has' +
        ' failed. Make sure triggerName is correct or remove the directive', e);
    }
  }

  /**
   * Subscribes to the menu triggers menuClosed event, and removes the event listener
   * TODO: Replace eventListener with observable?
   * fromEvent(document, 'mousedown')
   */
  private listenToMenuClose() {
    this._matMenuTrigger.menuClosed
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(() => {
      document.removeEventListener('mousedown', this.closeMenu);
    });
  }

  /**
   * Subscribes to the menu triggers menuOpened event, and creates an event listener on mousedown events
   * TODO: Replace eventListener with observable?
   * fromEvent(document, 'mousedown')
   */
  private listenToMenuOpen() {
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
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  constructor(private _view: ViewContainerRef) {

  }

}

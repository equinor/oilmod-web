import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material';

/**
 * This is a menu that adds a style to the backdrop that allow click events to go through.
 * Because the close event is on the backdrop, we add a listener this feature.
 * Case: GLI-593
 */
@Directive({
  selector: '[stoIgnoreContextmenuBackdrop]'
})
export class StoIgnoreContextmenuBackdropDirective implements OnInit {

  @Input('stoIgnoreContextmenuBackdrop') triggerName: string;

  private _matMenu: MatMenuPanel;
  private _matMenuTrigger: MatMenuTrigger;

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
      const component = (<any>this._view)._view.component;
      this._matMenuTrigger = component[this.triggerName];
      this._matMenu = this._matMenuTrigger.menu;

      this._matMenuTrigger.menuOpened.subscribe(() => {
        const _overlay = (<any>this._matMenuTrigger)._overlayRef.backdropElement;
        _overlay.style.pointerEvents = 'none';
        setTimeout(() => { // The trigger from code is set in a setTimeout so this has to be as well.
          document.addEventListener('mousedown', this.closeMenu);
        });
      });

      this._matMenuTrigger.menuClosed.subscribe(() => {
        document.addEventListener('mousedown', this.closeMenu);
      });

    } catch (e) {
      console.error('This directive was build on undocumented features and uses private methods.and now it has' +
        ' failed. Make sure triggerName is correct or remove the directive', e);
    }
  }

  constructor(private _view: ViewContainerRef) {

  }

}

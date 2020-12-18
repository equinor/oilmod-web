import { AfterContentInit, ContentChildren, Directive, OnDestroy, OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

/**
 * This is a directive for mat-select's that adds a style to the backdrop that allow click events to go through.
 * In addition, it alters the select hover behaviour, where hover will also set a focus state, enabling keyboard
 * navigation
 * Because the close event is on the backdrop, we add a listener this feature.
 * Case: GLI-593
 */
@Directive({
  selector: '[stoIgnoreMenuBackdrop]'
})
export class StoIgnoreMenuBackdropDirective implements AfterContentInit, OnInit, OnDestroy {

  /**
   * A {QueryList} containing all the options within the select
   */
  @ContentChildren(MatOption) options: QueryList<MatOption>;

  private destroyed$ = new Subject();
  private _matSelect: MatSelect;
  private _overlayRef: OverlayRef;

  constructor(private vcRef: ViewContainerRef) {

  }

  /**
   * closeMenu checks if the click event is outside the select list, and closes the select
   * @param event
   */
  private closeMenu = (event) => {
    const target = this._overlayRef.overlayElement;
    if ( !target || !target.contains(( event.target as any )) ) {
      this._matSelect.close();
    }
  }

  ngAfterContentInit() {
    this.focusOptionOnHover(this.options);
  }

  /**
   * focusOptionOnHover listens to all mat-option elements for mouseenter events.
   * On mouseenter, it will propagate this change, and set this item as focused
   * This enables keyboard navigation from any elements that are hovered
   * @param options
   */
  private focusOptionOnHover(options: QueryList<MatOption>) {
    options.changes
      .pipe(
        startWith(options),
        /**
         * switchMap takes the changes in, and creates a new, combined observable listening to mouseenter events on
         * each option
         */
        switchMap(opts => merge(
          opts.map(
            (opt, i) =>
              fromEvent<any>(opt._getHostElement(), 'mouseenter')
                .pipe(map(() => ({opt, i})))
          )
        )),
        takeUntil(this.destroyed$)
      ).subscribe(
      (x) => {
        const { opt, i } = x as any;
        if ( this._matSelect ) {
          this._matSelect._keyManager.setActiveItem(i);
        }
      }
    );
  }

  ngOnInit(): void {
    try {
      const parentComponent = ( this.vcRef as any )._view.context;
      this._matSelect = parentComponent;
      this.listenForSelectStateChange();
    } catch (e) {
      console.error('This StoSelectDirective was build on undocumented features, and now it has failed. Remove or' +
        ' fix the directive.', e);
    }
  }

  /**
   * Listens for changes to the mat-select's open state
   * On open, we add an event listener trigger using {@link closeMenu}
   * On close, the event listener is removed
   * TODO: Replace with fromEvent(..) ?
   */
  private listenForSelectStateChange() {
    this._matSelect.openedChange
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe((isOpen) => {
      this._overlayRef = this._matSelect.overlayDir.overlayRef;
      if (this._overlayRef) {
        this._overlayRef.backdropElement.style.pointerEvents = 'none';
      }
      if (isOpen) {
        document.addEventListener('mousedown', this.closeMenu);
      } else {
        document.removeEventListener('mousedown', this.closeMenu);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

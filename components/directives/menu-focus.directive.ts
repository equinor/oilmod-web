import { AfterContentInit, ContentChildren, Directive, Host, Input, OnDestroy, QueryList, Self } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DOWN_ARROW, LEFT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

@Directive({
  selector: '[stoMenuFocus]'
})
export class StoMenuFocusDirective implements AfterContentInit, OnDestroy {
  /**
   * Element created on the dom (and removed on host destroy), use to have an inivisible initial focus
   */
  private focusElement: HTMLElement;
  private destroyed$ = new Subject();
  /**
   * QueryList<Menuitem> contains all the menu items for the given directive
   */
  @ContentChildren(MatMenuItem) menuItems: QueryList<MatMenuItem>;

  /**
   * triggers is a QueryList of all the triggers pointing to this menu
   * This needs to be applied from the host component, and needs to be via ViewChildren
   * If we just pass in the actual trigger, we can't subscribe to change events, meaning any triggers added *after*
   * view is initialized, will not be checked
   * @param {QueryList<MatMenuTrigger>} triggers
   */
  @Input()
  set triggers(triggers: QueryList<MatMenuTrigger>) {
    if (triggers) {
      this.createHiddenFocusElement();
      this.setFocusFromElement(this.focusElement);
      this.listenOnMenuOpened(triggers);
    }
  }

  /**
   * Listens for when the menu is opened, and focuses on {@link focusElement} after waiting 20 ms (~1 frame)
   * Will additionally replace the listeners whenever new triggers are added
   * @param {QueryList<MatMenuTrigger>} triggers
   */
  private listenOnMenuOpened(triggers: QueryList<MatMenuTrigger>) {
    triggers.changes
      .pipe(
        startWith(triggers),
        switchMap(newTriggers => {
          const filteredTriggers = newTriggers
            .filter(trigg => trigg.menu === this.menu);
          return merge(...filteredTriggers.map(trigger => trigger.menuOpened));
        }),
        debounceTime(20),
        takeUntil(this.destroyed$)
      ).subscribe(() => {
      this.focusElement.focus();
    });
  }

  /**
   * Handles keydown events on our fake menu item
   * @see handleFakeFocus
   * @param {HTMLElement} el
   */
  private setFocusFromElement(el: HTMLElement) {
    fromEvent(el, 'keydown')
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(
      this.handleFakeFocus.bind(this),
      this.illegalErrorException.bind(this)
    );
  }

  /**
   * Handler for keyboard events on our fake menu item
   * @param {KeyboardEvent} e
   */
  private handleFakeFocus(e: KeyboardEvent) {
    if (e.keyCode === DOWN_ARROW) {
      this.focusElement.blur();
      this.menu.focusFirstItem();
    }
    if (e.keyCode === UP_ARROW) {
      this.focusElement.blur();
      const last = this.menuItems.filter(item => !item.disabled)
        .reverse()[0];
      const i = this.menuItems.toArray().findIndex(item => item === last);
      last.focus();
      (<any>this.menu)._keyManager.setActiveItem(i);
    }
    if (e.keyCode === LEFT_ARROW && this.menu.parentMenu) {
      this.menu._handleKeydown(e);
    }
  }

  /**
   * Handle subscription errors - a lot of the methods we use are undocumented and private
   * To ensure we don't get an application crash, we use this to handle our errors
   * @param {Error} err
   */
  private illegalErrorException(err: Error) {
    console.error('Menu directive depends on some illegal methods - this has now broken', err);
  }

  /**
   * Creates {@link focusElement}, and appends it outside of the viewport
   */
  private createHiddenFocusElement() {
    const el = document.createElement('button');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    this.focusElement = el;
  }

  /**
   * Listens for changes to hover on the items in the menu, and focuses the element, enabling keyboard shortcuts
   * Additionally listens to changes to dynamic menu items, and replaces the listener
   * @param {QueryList<MatMenuItem>} menuItems
   */
  private updateFocusOnHover(menuItems: QueryList<MatMenuItem>) {
    menuItems.changes
      .pipe(
        startWith(this.menuItems),
        switchMap((list: QueryList<MatMenuItem>) => {
          const elementListeners = list
            .map((el, i) => {
              return el._hovered.asObservable()
                .pipe(map(() => ({el, i})));
            });
          return merge(...elementListeners);
        }),
        takeUntil(this.destroyed$)
      ).subscribe(({el, i}) => {
      try {
        el.focus();
        (<any>this.menu)._keyManager.setActiveItem(i);
      } catch (ex) {
        console.error('Menu focus directive relies on private methods. If you are seeing this, it broke.', ex);
      }
    }, this.illegalErrorException.bind(this));
  }

  ngAfterContentInit() {
    this.menu._classList = {...this.menu._classList, 'sto-menu': true};
    this.updateFocusOnHover(this.menuItems);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    /**
     * Strip our fake menu element from the DOM on destroy to avoid memory leaks.
     */
    document.body.removeChild(this.focusElement);
  }

  constructor(@Host() @Self() private menu: MatMenu) {
  }

}

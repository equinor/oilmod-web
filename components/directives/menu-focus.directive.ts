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
  private focusElement: HTMLElement;
  private destroyed$ = new Subject();
  @ContentChildren(MatMenuItem) menuItems: QueryList<MatMenuItem>;

  @Input()
  set triggers(triggers: QueryList<MatMenuTrigger>) {
    if (triggers) {
      this.createHiddenFocusElement();
      this.setFocusFromElement(this.focusElement);
      this.listenOnMenuOpened(triggers);
    }
  }

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

  private setFocusFromElement(el: HTMLElement) {
    fromEvent(el, 'keydown')
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(
      this.handleFakeFocus.bind(this),
      this.illegalErrorException.bind(this)
    );
  }

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

  private illegalErrorException(err: Error) {
    console.error('Menu directive depends on some illegal methods - this has now broken', err);
  }

  private createHiddenFocusElement() {
    const el = document.createElement('button');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    this.focusElement = el;
  }

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
    document.body.removeChild(this.focusElement);
  }

  constructor(@Host() @Self() private menu: MatMenu) {
  }

}

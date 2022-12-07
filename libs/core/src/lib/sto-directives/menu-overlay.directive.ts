import { Directive, ElementRef, Host, HostBinding } from '@angular/core';
import { MatLegacyMenuPanel as MatMenuPanel, MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { fromEvent } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Directive({
  selector: '[stoMenuOverlay]',
  exportAs: 'stoMenuOverlay',
  standalone: true
})
export class MenuOverlayDirective {
  @HostBinding('style.left.px')
  left = 0;
  @HostBinding('style.top.px')
  top = 0;
  private readonly menu: MatMenuPanel;

  constructor(@Host() private trigger: MatMenuTrigger, el: ElementRef<HTMLButtonElement>) {
    this.menu = trigger.menu as MatMenuPanel;
    this.trigger.menuOpened.pipe(
      switchMap(() =>
        fromEvent<MouseEvent>(document, 'click')
          .pipe(take(1))
      ),
    ).subscribe(() => {
      this.trigger.closeMenu();
    });
    this.setStyle(el.nativeElement);
  }

  public updatePosition(event: MouseEvent) {
    this.left = event.x;
    this.top = event.y;
  }

  private setStyle(element: HTMLButtonElement) {
    element.style.overflow = 'hidden';
    element.style.position = 'fixed';
    element.style.height = '1px';
    element.style.width = '1px';
  }
}

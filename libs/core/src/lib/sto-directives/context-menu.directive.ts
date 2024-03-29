import { Directive, HostListener, Input } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { MenuOverlayDirective } from './menu-overlay.directive';

@Directive({
  selector: '[stoContextMenu]',
  standalone: true
})
export class ContextMenuDirective {
  @Input()
  menuTrigger: MatMenuTrigger;
  @Input()
  overlayDirective: MenuOverlayDirective;
  @Input()
  menuContext: unknown;

  @HostListener('contextmenu', [ '$event' ])
  contextMenu(event: MouseEvent) {
    event.preventDefault();
    if ( this.menuTrigger.menuOpen ) {
      this.menuTrigger.closeMenu();
    }
    this.overlayDirective.updatePosition(event);
    setTimeout(() => {
      this.menuTrigger.menuData = this.menuContext;
      this.menuTrigger.openMenu();
    }, 150);
  }

}

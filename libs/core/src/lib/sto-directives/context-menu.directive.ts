import { Directive, HostListener, input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuOverlayDirective } from './menu-overlay.directive';

@Directive({
  selector: '[stoContextMenu]',
})
export class ContextMenuDirective {
  readonly menuTrigger = input.required<MatMenuTrigger>();
  readonly overlayDirective = input.required<MenuOverlayDirective>();
  readonly menuContext = input<unknown>();

  @HostListener('contextmenu', ['$event'])
  contextMenu(event: MouseEvent) {
    event.preventDefault();
    if (this.menuTrigger().menuOpen) {
      this.menuTrigger().closeMenu();
    }
    this.overlayDirective().updatePosition(event);
    setTimeout(() => {
      this.menuTrigger().menuData = this.menuContext();
      this.menuTrigger().openMenu();
    }, 150);
  }
}

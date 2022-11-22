import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sto-drawer-header',
  template: `
    <ng-content></ng-content>`,
  styleUrls: [ './sto-drawer.component.scss' ],
  standalone: true
})
export class StoDrawerHeaderComponent {
  @HostBinding('class.sto-drawer__header') class = true;
}

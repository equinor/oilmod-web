import { Component } from '@angular/core';

@Component({
  selector: 'sto-drawer-header',
  template: ` <ng-content></ng-content>`,
  styleUrl: './sto-drawer.component.scss',
  host: {
    class: 'sto-drawer__header',
  },
})
export class StoDrawerHeaderComponent {}

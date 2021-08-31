import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { NavigationChild } from '../navigation';

@Component({
  selector: 'sto-nav-drawer-list',
  templateUrl: './nav-drawer-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListComponent {
  @Input()
  navigationItems: Array<NavigationChild>;
}
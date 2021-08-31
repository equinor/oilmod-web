import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NavigationChild } from '../navigation';

@Component({
  selector: 'sto-nav-drawer-list-item',
  templateUrl: './nav-drawer-list-item.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListItemComponent {
  @Input()
  navigationItem: NavigationChild;
}
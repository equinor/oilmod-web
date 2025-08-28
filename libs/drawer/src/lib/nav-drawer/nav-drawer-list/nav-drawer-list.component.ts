import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { NavigationChild } from '../navigation';
import { NavDrawerListItemComponent } from '../nav-drawer-list-item/nav-drawer-list-item.component';


@Component({
    selector: 'sto-nav-drawer-list',
    templateUrl: './nav-drawer-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
    NavDrawerListItemComponent
],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListComponent {
  readonly navigationItems = input<Array<NavigationChild>>();
  readonly activate = output<NavigationChild>();
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NavigationChild } from '../navigation';
import { NavDrawerListItemComponent } from '../nav-drawer-list-item/nav-drawer-list-item.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'sto-nav-drawer-list',
  templateUrl: './nav-drawer-list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NavDrawerListItemComponent,
    NgForOf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListComponent {
  @Input()
  navigationItems: Array<NavigationChild>;
  @Output()
  activate = new EventEmitter<NavigationChild>();
}

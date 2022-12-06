import { NavDrawerComponent } from './nav-drawer.component';
import { NavDrawerItemComponent } from './nav-drawer-item/nav-drawer-item.component';
import { NavDrawerListComponent } from './nav-drawer-list/nav-drawer-list.component';
import { NavDrawerListItemComponent } from './nav-drawer-list-item/nav-drawer-list-item.component';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerListComponent,
    NavDrawerListItemComponent,
  ],
  exports: [
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerListComponent,
    NavDrawerListItemComponent,
  ]
})
export class NavDrawerModule {
}

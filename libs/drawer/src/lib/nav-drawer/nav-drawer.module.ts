import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavDrawerComponent } from './nav-drawer.component';
import { NavDrawerItemComponent } from './nav-drawer-item/nav-drawer-item.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavDrawerListComponent } from './nav-drawer-list/nav-drawer-list.component';
import { NavDrawerListItemComponent } from './nav-drawer-list-item/nav-drawer-list-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerListComponent,
    NavDrawerListItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatRippleModule
  ],
  exports: [
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerListComponent,
    NavDrawerListItemComponent,
  ]
})
export class NavDrawerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPartComponent } from './navigation-part/navigation-part.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NavigationMenuItemComponent } from './navigation-menu/navigation-menu-item/navigation-menu-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports: [
      CommonModule
    , MatIconModule
    , MatButtonModule
    , MatListModule
    , MatExpansionModule
  ],
  exports: [
      NavigationPartComponent
    , NavigationMenuComponent
    , NavigationMenuItemComponent
  ],
  declarations: [
      NavigationPartComponent
    , NavigationMenuComponent
    , NavigationMenuItemComponent
  ],
})
export class StoNavigationModule {
}


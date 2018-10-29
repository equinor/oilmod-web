import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPartComponent } from './navigation-part/navigation-part.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NavigationMenuItemComponent } from './navigation-menu/navigation-menu-item/navigation-menu-item.component';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatListModule } from '@angular/material';


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
  ]
})
export class StoNavigationModule {
}
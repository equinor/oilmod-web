import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationChild } from '../navigation';

@Component({
  selector: 'sto-nav-drawer-list-item',
  templateUrl: './nav-drawer-list-item.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, RouterLinkActive, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavDrawerListItemComponent {
  readonly navigationItem = input.required<NavigationChild>();
  readonly activate = output<NavigationChild>();
}

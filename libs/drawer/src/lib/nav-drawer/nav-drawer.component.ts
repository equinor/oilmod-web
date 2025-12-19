import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  model,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { overlayAnimation } from '../animation';
import { NavDrawerItemComponent } from './nav-drawer-item/nav-drawer-item.component';
import { Navigation } from './navigation';

@Component({
  selector: 'sto-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrl: './nav-drawer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [overlayAnimation],
  imports: [MatButtonModule, MatIconModule, NavDrawerItemComponent],
})
export class NavDrawerComponent {
  readonly collapsed = model(false);
  readonly navigationItems = input<Array<Navigation>>();
  readonly withAppHeader = input<boolean>();
  readonly activate = output<Navigation>();
  readonly headerOffset = '5em';

  onActivate(item: Navigation) {
    this.activate.emit(item);
    this.collapsed.set(true);
  }
}

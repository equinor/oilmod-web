import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Navigation } from './navigation';

@Component({
  selector: 'sto-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavDrawerComponent {
  @Input()
  collapsed = false;
  @Input()
  navigationItems: Array<Navigation>;
}

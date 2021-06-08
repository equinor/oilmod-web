import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Menu, NavigateCommand } from './menu';

@Component({
  selector: 'sto-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuComponent {

  @Input() menu: Menu;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onCommand = new EventEmitter<NavigateCommand>();

}

import { Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { USE_HASH_ROUTING } from '../../tokens';
import { MenuItem, MenuItemTypes, NavigateCommand } from '../menu';

@Component({
  selector: 'sto-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuItemComponent {
  @Input() item: MenuItem;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onCommand = new EventEmitter<NavigateCommand>();
  public menuItemTypes = MenuItemTypes;
  public urlPrefix: string;

  constructor(@Inject(USE_HASH_ROUTING) @Optional() useHash: boolean) {
    this.urlPrefix = useHash === false ? '/' : '#/';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public navigate($event: KeyboardEvent | MouseEvent, command: any, item: { error?: string; }) {
    if ( item.error ) {
      return;
    }
    this.onCommand.emit({ $event, command });
  }

}

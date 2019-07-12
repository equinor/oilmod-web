import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { USE_HASH_ROUTING } from '../../tokens';

@Component({
  selector: 'sto-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styles: []
})
export class NavigationMenuItemComponent {
  @Input() item: any;
  @Output() onCommand = new EventEmitter<any>();
  public urlPrefix: string;

  public navigate($event, command, item) {
    if ( item.error ) {
      return;
    }
    this.onCommand.emit({ $event, command });
  }

  constructor(@Inject(USE_HASH_ROUTING) @Optional() useHash: boolean) {
    this.urlPrefix = useHash === false ? '/' : '#/';
  }

}

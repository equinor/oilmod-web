import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sto-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styles: []
})
export class NavigationMenuItemComponent {
  @Input() item: any;
  @Output() onCommand = new EventEmitter<any>();

  public navigate($event, command, item) {
    if (item.error) {
      return;
    }
    this.onCommand.emit({$event, command});
  }

  constructor() {}

}

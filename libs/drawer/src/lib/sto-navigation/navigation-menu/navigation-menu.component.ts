import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Menu, NavigateCommand } from './menu';

@Component({
  selector: 'sto-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuComponent implements OnInit {

  @Input() menu: Menu;
  @Output() onCommand = new EventEmitter<NavigateCommand>();

  ngOnInit() {

  }


}

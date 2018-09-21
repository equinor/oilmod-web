import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sto-navigation-menu',
  templateUrl: './navigation-menu.component.html'
})
export class NavigationMenuComponent implements OnInit {

  @Input() menu: any;
  @Output() onCommand = new EventEmitter<any>();

  ngOnInit() {

  }


}

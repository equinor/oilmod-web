import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NavigationChild } from '../navigation';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'sto-nav-drawer-list-item',
  templateUrl: './nav-drawer-list-item.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    RouterLinkActive,
    RouterLink,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListItemComponent {
  @Input()
  navigationItem: NavigationChild;
  @Output()
  activate = new EventEmitter<NavigationChild>();
}

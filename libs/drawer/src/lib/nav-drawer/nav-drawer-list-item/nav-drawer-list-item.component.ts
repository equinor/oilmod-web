import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, output } from '@angular/core';
import { NavigationChild } from '../navigation';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'sto-nav-drawer-list-item',
    templateUrl: './nav-drawer-list-item.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    NgTemplateOutlet
],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavDrawerListItemComponent {
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input()
  navigationItem: NavigationChild;
  readonly activate = output<NavigationChild>();
}

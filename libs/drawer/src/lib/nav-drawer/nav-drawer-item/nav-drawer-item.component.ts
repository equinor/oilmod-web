import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  input,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { EXPANSION_PANEL_ANIMATION_TIMING } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavDrawerListComponent } from '../nav-drawer-list/nav-drawer-list.component';
import { Navigation } from '../navigation';

@Component({
    selector: 'sto-nav-drawer-item',
    templateUrl: './nav-drawer-item.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    MatButtonModule,
    RouterLinkActive,
    MatIconModule,
    RouterLink,
    MatMenuModule,
    MatDividerModule,
    NavDrawerListComponent,
    MatRippleModule
],
    animations: [
        /** Animation that rotates the indicator arrow. */
        trigger('indicatorRotate', [
            state('collapsed, void', style({ transform: 'rotate(0deg)' })),
            state('expanded', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
        ]),
        /** Animation that expands and collapses the panel content. */
        trigger('bodyExpansion', [
            state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
        ]),
    ]
})
export class NavDrawerItemComponent {
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input()
  navigationItem: Navigation;
  readonly collapsed = input<boolean>();
  readonly activate = output<Navigation>();

  private _expansionState: 'collapsed' | 'expanded' = 'collapsed';

  public get expansionState() {
    return this.collapsed() ? 'collapsed' : this._expansionState;
  }

  public set expansionState(state) {
    this._expansionState = state;
  }

  toggleExpansionState() {
    if (
      !this.navigationItem.children ||
      this.navigationItem.children.length === 0
    ) {
      return;
    }
    this.expansionState =
      this.expansionState === 'collapsed' ? 'expanded' : 'collapsed';
  }
}

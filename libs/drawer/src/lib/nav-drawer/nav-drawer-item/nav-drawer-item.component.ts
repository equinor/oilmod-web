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
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import { NavDrawerListComponent } from '../nav-drawer-list/nav-drawer-list.component';
import { Navigation } from '../navigation';

/** Animation timing for expansion panel (removed in Angular Material 21) */
const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

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
    MatRippleModule,
  ],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed, void', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed, void => collapsed',
        animate(EXPANSION_PANEL_ANIMATION_TIMING),
      ),
    ]),
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed, void => collapsed',
        animate(EXPANSION_PANEL_ANIMATION_TIMING),
      ),
    ]),
  ],
})
export class NavDrawerItemComponent {
  private readonly router = inject(Router);

  readonly navigationItem = input.required<Navigation>();
  readonly collapsed = input<boolean>();
  readonly activate = output<Navigation>();

  private readonly expansionState = signal<'collapsed' | 'expanded'>(
    'collapsed',
  );

  readonly currentExpansionState = computed(() =>
    this.collapsed() ? 'collapsed' : this.expansionState(),
  );

  routerEvents = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
  );

  readonly isChildRouteActive = computed(() => {
    const item = this.navigationItem();
    // Trigger recomputation when router events occur
    this.routerEvents();

    if (!item?.children?.length) {
      return false;
    }

    return item.children.some((child) => {
      if (!child.route) return false;

      return this.router.isActive(this.router.createUrlTree(child.route), {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
    });
  });

  // Auto expand if a child route is active
  onChildRouteActivated = effect(() => {
    if (this.isChildRouteActive() && !this.collapsed()) {
      this.expansionState.set('expanded');
    }
  });

  toggleExpansionState(): void {
    const item = this.navigationItem();
    if (!item?.children?.length) {
      return;
    }

    this.expansionState.update((state) =>
      state === 'collapsed' ? 'expanded' : 'collapsed',
    );
  }
}

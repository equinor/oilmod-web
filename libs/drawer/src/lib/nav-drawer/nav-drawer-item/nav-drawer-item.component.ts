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
  Route,
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

  /**
   * Determines if the route should use exact matching for routerLinkActive.
   * Reads the route config's pathMatch property - if 'full', uses exact matching.
   * This prevents routes like '/' from being marked active on all child routes
   * when configured with pathMatch: 'full'.
   */
  readonly routerLinkActiveOptions = computed(() => {
    const route = this.navigationItem().route;
    if (!route) return { exact: false };

    // Get the resolved URL path
    const urlTree = this.router.createUrlTree(route);
    const url = this.router.serializeUrl(urlTree);

    // Find the matching route config and check its pathMatch
    const routeConfig = this.findRouteConfig(url);

    return { exact: routeConfig?.pathMatch === 'full' };
  });

  /**
   * Finds the route config for a given URL path by searching the router config.
   */
  private findRouteConfig(url: string): Route | undefined {
    const normalizedPath = url === '/' ? '' : url.replace(/^\//, '');

    // Search top-level routes
    const topLevel = this.router.config.find((r) => r.path === normalizedPath);
    if (topLevel) return topLevel;

    // Search nested routes (one level deep for common cases)
    for (const route of this.router.config) {
      if (route.children) {
        const child = route.children.find((r) => {
          const fullPath = route.path ? `${route.path}/${r.path}` : r.path;
          return fullPath === normalizedPath;
        });
        if (child) return child;
      }
    }

    return undefined;
  }

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

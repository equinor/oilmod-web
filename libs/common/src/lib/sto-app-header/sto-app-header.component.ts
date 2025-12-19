import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { fromEvent } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Breadcrumb } from '../sto-breadcrumbs/breadcrumb';

import { typography, TypographyName } from '../theme/models';
import { StoThemeService } from '../theme/theme.service';
import { StoBreadcrumbsComponent } from '../sto-breadcrumbs/sto-breadcrumbs.component';

/**
 * StoAppHeaderComponent is used to create an App header toolbar with a common look / feel across our portfolio
 *
 * @example
 *
 * <sto-app-header [homeBreadCrumbConfig]="{ command: () => openDrawer() }"
 *    [breadCrumbs]="[{ label: 'Planning', segment: 'planning' }]">
 * </sto-app-header>
 */
@Component({
  selector: 'sto-app-header',
  templateUrl: './sto-app-header.component.html',
  styleUrl: './sto-app-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StoBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    LayoutModule
],
})
export class StoAppHeaderComponent {
  private readonly themeService = inject(StoThemeService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * testEnvironment tells the header whether or not to style itself defining a test-environment
   */
  readonly testEnvironment = input<boolean>(false);

  /**
   * If {@link testEnvironment} is true, this name is printed out centered on the header
   */
  readonly environmentName = input<string>('');

  /**
   * Input for user information menu.
   */
  readonly userMenu = input<MatMenuPanel>();

  /**
   * Configuration that determines what to do when clicking the top-level menu icon
   */
  readonly homeBreadCrumbConfig = input<Breadcrumb>();

  /**
   * Configuration used to print out the relevant application breadcrumbs.
   */
  readonly breadCrumbs = input<Breadcrumb[]>();

  readonly darkmode = toSignal(
    this.themeService
      .getActiveTheme()
      .pipe(map((theme) => theme && theme.name === 'dark')),
    { initialValue: false },
  );

  readonly isSmall = toSignal(
    this.breakpointObserver
      .observe(['(max-width: 500px)'])
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  readonly menuOpen = signal(false);

  toggleTheme() {
    const themeName = document.body.classList.contains('sto-dark-theme')
      ? 'light'
      : 'dark';
    this.themeService.setTheme(themeName);
  }

  toggleTypography(className?: string) {
    const small = className === typography.get('small');
    const large = className === typography.get('large');
    const typographyName: TypographyName = small
      ? 'small'
      : large
        ? 'large'
        : 'medium';
    this.themeService.setTypography(typographyName);
  }

  toggleMenu(event: MouseEvent) {
    this.menuOpen.update((open) => !open);
    if (this.menuOpen()) {
      fromEvent(document, 'click')
        .pipe(
          filter((e) => e !== event),
          filter((e) => {
            const t = e.target as HTMLElement;
            if (!t || !t.parentElement) {
              return true;
            }
            let parent = t;
            let iterations = 0;
            while (parent.parentElement && iterations < 5) {
              if (parent.classList.contains('mat-menu-trigger')) {
                return false;
              }
              iterations = iterations + 1;
              parent = parent?.parentElement;
            }
            return true;
          }),
          take(1),
        )
        .subscribe(() => {
          this.menuOpen.set(false);
        });
    }
  }
}

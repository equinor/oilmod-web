import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from '../sto-breadcrumbs/breadcrumb';
import { MatMenuPanel } from '@angular/material/menu';
import { StoThemeService } from '../theme/theme.service';
import { typography, TypographyName } from '../theme/models';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  styleUrls: [ './sto-app-header.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoAppHeaderComponent implements OnInit {
  /**
   * testEnvironment tells the header whether or not to style itself defining a test-environment
   */
  @Input()
  testEnvironment: boolean;
  /**
   * If {@link testEnvironment} is true, this name is printed out centered on the header
   */
  @Input()
  environmentName: string;
  /**
   * Input for user information menu.
   */
  @Input()
  userMenu: MatMenuPanel;
  /**
   * Configuration that determines what to do when clicking the top-level menu icon
   */
  @Input()
  homeBreadCrumbConfig: { command: () => void };
  /**
   * Configuration used to print out the relevant application breadcrumbs.
   */
  @Input()
  breadCrumbs: Breadcrumb[];

  public darkmode$: Observable<boolean>;
  public isSmall$: Observable<boolean>;
  public menuOpen: boolean;

  constructor(
    private themeService: StoThemeService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
  }

  toggleTheme() {
    const themeName = document.body.classList.contains('sto-dark-theme') ? 'light' : 'dark';
    this.themeService.setTheme(themeName);
  }

  toggleTypography(className?: string) {
    const small = className === typography.get('small');
    const large = className === typography.get('large');
    const typographyName: TypographyName = small ? 'small' : large ? 'large' : 'medium';
    this.themeService.setTypography(typographyName);
  }

  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;
    if ( this.menuOpen ) {
      fromEvent(document, 'click')
        .pipe(
          filter(e => e !== event),
          filter(e => {
            const t = e.target as HTMLElement;
            if ( !t || !t.parentElement ) {
              return true;
            }
            let parent = t;
            let iterations = 0;
            while ( parent.parentElement && iterations < 5 ) {
              if ( parent.classList.contains('mat-menu-trigger') ) {
                return false;
              }
              iterations = iterations + 1;
              parent = parent?.parentElement;
            }
            return true;
          }),
          take(1)
        )
        .subscribe(() => {
          this.menuOpen = false;
          this.cdr.markForCheck();
        });
    }
  }

  ngOnInit(): void {
    this.darkmode$ = this.themeService.getActiveTheme()
      .pipe(map(theme => theme && theme.name === 'dark'));
    this.isSmall$ = this.breakpointObserver.observe([ '(max-width: 500px)' ]).pipe(map(r => r.matches));
  }
}

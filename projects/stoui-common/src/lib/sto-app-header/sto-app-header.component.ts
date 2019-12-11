import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from '../sto-breadcrumbs/breadcrumb';

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
export class StoAppHeaderComponent implements AfterViewInit {
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
   * Configuration that determines what to do when clicking the top-level menu icon
   */
  @Input()
  homeBreadCrumbConfig: { command: Function };
  /**
   * Configuration used to print out the relevant application breadcrumbs.
   */
  @Input()
  breadCrumbs: Breadcrumb[];

  public nightmode: boolean;

  toggleTheme() {
    document.body.classList.toggle('sto-dark-theme');
    this.nightmode = document.body.classList.contains('sto-dark-theme');
  }

  toggleTypography(className?: string) {
    document.body.classList.remove('sto-sm-typography', 'sto-l-typography');
    if ( className ) {
      document.body.classList.add(className);
    }
  }

  ngAfterViewInit(): void {
    this.nightmode = document.body.classList.contains('sto-dark-theme');
  }
}

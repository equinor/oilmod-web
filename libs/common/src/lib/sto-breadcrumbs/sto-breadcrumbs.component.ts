import {
  Component,
  ViewEncapsulation,
  inject,
  input,
  computed,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  Breadcrumb,
  BreadcrumbConfig,
  NAVIGATION_HOME_ICON,
} from './breadcrumb';

import { MatIconModule } from '@angular/material/icon';

/**
 * Breadcrumbs is the navigation scheme that reveals the user's location on the web application.
 * It shows both a home icon and the path that could be an url or a command/function (e.g open a drawer, popup etc).
 */
@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrl: './sto-breadcrumbs.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sto-breadcrumb',
  },
  imports: [MatIconModule, RouterLink],
})
export class StoBreadcrumbsComponent {
  private readonly router = inject(Router);

  /**
   * An object that can contain a url segment or a command.
   */
  readonly home = input<Breadcrumb>();

  /**
   * A list of breadcrumb items which can be a url segment { segment: 'inventory' } or a command { command: () => {} }.
   */
  readonly model = input<Breadcrumb[]>([]);

  readonly iconConfig: BreadcrumbConfig = inject(NAVIGATION_HOME_ICON, {
    optional: true,
  }) ?? { icon: 'apps' };

  /**
   * Computed title from breadcrumb model for screen readers and tooltips
   */
  readonly title = computed(() =>
    this.model()
      .map((item) => item.label)
      .join(' / '),
  );

  itemClick(event: Event, item: Breadcrumb | undefined): void {
    if (!item || item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.command) {
      event.preventDefault();
      item.command({ originalEvent: event, item });
    } else if (item.segment) {
      event.preventDefault();
      this.router
        .navigate([item.segment], { queryParamsHandling: 'preserve' })
        .catch(console.error);
    } else if (!item.url) {
      event.preventDefault();
    }
  }
}

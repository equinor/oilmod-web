import { Component, inject, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'sto-navigation',
    template: `
    <nav mat-tab-nav-bar
      [tabPanel]="tabPanel">
      @for (link of links(); track link) {
        <a mat-tab-link
          [routerLink]="link.route"
          (click)="activeLink = link"
          #rla="routerLinkActive"
          [active]="rla.isActive"
        routerLinkActive="mat-tab-label-active"> {{link.label}} </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
    `,
    imports: [
    MatTabsModule,
    RouterLink,
    RouterLinkActive
]
})
export class NavigationComponent {
  public activeLink: { route: string[]; label: string };
  readonly links = input<Array<{
    route: Array<string>;
    label: string;
}>>();
  private route = inject(ActivatedRoute);
  public activeRoute$ = this.route.url.pipe(tap(console.log));
}

import { Component, inject, Input } from '@angular/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { NgForOf } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'sto-navigation',
  standalone: true,
  template: `
    <nav mat-tab-nav-bar
         [tabPanel]="tabPanel">
      <a mat-tab-link
         *ngFor="let link of links"
         [routerLink]="link.route"
         (click)="activeLink = link"
         #rla="routerLinkActive"
         [active]="rla.isActive"
         routerLinkActive="mat-tab-label-active"> {{link.label}} </a>
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
  `,
  imports: [
    MatTabsModule,
    NgForOf,
    RouterLink,
    RouterLinkActive,
  ]
})
export class NavigationComponent {
  public activeLink: { route: string[]; label: string };
  @Input()
  links: Array<{ route: Array<string>; label: string }>;
  private route = inject(ActivatedRoute);
  public activeRoute$ = this.route.url.pipe(tap(console.log));
}

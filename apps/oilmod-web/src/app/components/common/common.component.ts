import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
    template: `
    <sto-navigation [links]="links"></sto-navigation>
    <router-outlet></router-outlet>
  `,
    imports: [
        NavigationComponent,
        RouterOutlet,
    ]
})
export class CommonComponent {
  public links = [
    { route: [ '/', 'common', 'preference-manager' ], label: 'Preference manager' },
    { route: [ '/', 'common', 'action-footer' ], label: 'Action footer' },
    { route: [ '/', 'common', 'breadcrumbs' ], label: 'Breadcrumbs' },
    { route: [ '/', 'common', 'confirm-dialog' ], label: 'Confirm dialog' },
    { route: [ '/', 'common', 'message-panel' ], label: 'Message panels' },
  ];
}

import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
  template: `
    <sto-navigation [links]="links"></sto-navigation>
    <router-outlet></router-outlet>`,
  standalone: true,
  imports: [
    NavigationComponent,
    RouterOutlet
  ]
})
export class FormComponent {
  public links = [
    { route: [ '/', 'form', 'number-input' ], label: 'number-input' },
    { route: [ '/', 'form', 'number-unit-input' ], label: 'number-unit-input' },
    { route: [ '/', 'form', 'slide-toggle' ], label: 'slide-toggle' },
    { route: [ '/', 'form', 'sto-form' ], label: 'sto-form' },
    { route: [ '/', 'form', 'sto-option-select-all' ], label: 'sto-option-select-all' },
    { route: [ '/', 'form', 'sto-select-filter' ], label: 'sto-select-filter' },
    { route: [ '/', 'form', 'sto-wysiwyg' ], label: 'sto-wysiwyg' },
  ];
}

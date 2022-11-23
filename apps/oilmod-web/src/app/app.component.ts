import { Component } from '@angular/core';

@Component({
  selector: 'sto-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent {
  public links = [
    { route: [ '/', 'core' ], label: 'Core' },
    { route: [ '/', 'common' ], label: 'Common' },
    { route: [ '/', 'datatable' ], label: 'Datatable' },
    { route: [ '/', 'drawer' ], label: 'Drawer' },
    { route: [ '/', 'form' ], label: 'Form' },
  ];
}

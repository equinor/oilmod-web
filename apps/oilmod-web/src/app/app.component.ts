import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoAppHeaderComponent } from '@ngx-stoui/common';
import { NavigationComponent } from './components/navigation.component';

@Component({
  selector: 'sto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, StoAppHeaderComponent, NavigationComponent],
})
export class AppComponent {
  public links = [
    { route: ['/', 'core'], label: 'Core' },
    { route: ['/', 'common'], label: 'Common' },
    { route: ['/', 'datatable'], label: 'Datatable' },
    { route: ['/', 'drawer'], label: 'Drawer' },
    { route: ['/', 'form'], label: 'Form' },
  ];
}

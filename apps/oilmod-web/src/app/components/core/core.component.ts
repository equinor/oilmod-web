import { Component } from '@angular/core';
import { StylesComponent } from './styles.component';

@Component({
  template: `
    <sto-styles></sto-styles>`,
  standalone: true,
  imports: [ StylesComponent ]
})
export class CoreComponent {
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Demo app to debug UI components</h1>

    <p>You can test a module by importing it in app module - everything except styles can be imported as normal (from '@ngx-stoui/...').</p>
    <p>Styles can be imported by using <span class="code code--disabled">@import 'stoui-&lt;name&gt;/...';</span>
      needs to be done by symlinking the package (in package run <span class="code">yarn link</span>,
      and in project run <span class="code">yarn link @ngx-stoui/&lt;package&gt;</span>) </p>
    <br />
    <br />
    <a [routerLink]="['common']">Common module preview</a>
  `,
  styles: []
})
export class RootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

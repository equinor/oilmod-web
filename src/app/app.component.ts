import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public homeBreadCrumbConfig = {
    command: () => {
      console.log('Primary menu button clicked!');
    }
  };
  public breadCrumbs = [
    {label: 'DEMO', command: () => console.log('Application root button clicked')},
    {label: 'DEMO LVL 2', command: () => console.log('Application level 2 clicked')}
    ];
  ngOnInit() {
  }
}

import {Component, OnInit} from '@angular/core';
import * as conf from './lines';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  log = console.log;
  public lines: any[];
  public columns: any[];
  public columnGroups: any[];
  ready: boolean;
  ngOnInit() {
    this.lines = conf.lines
    this.columnGroups = conf.columnGroups;
    this.columns = conf.columns;
    setTimeout(() => this.ready = true, 500);
  }
}

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from '../sto-breadcrumbs/breadcrumb';

@Component({
  selector: 'sto-app-header',
  templateUrl: './sto-app-header.component.html',
  styleUrls: ['./sto-app-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoAppHeaderComponent implements OnInit {
  @Input()
  testEnvironment: boolean;
  @Input()
  environmentName: string;
  @Input()
  homeBreadCrumbConfig: {command: Function};
  @Input()
  breadCrumbs: Breadcrumb[];

  constructor() { }

  ngOnInit() {
  }

}

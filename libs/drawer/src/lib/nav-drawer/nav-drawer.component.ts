import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Navigation } from './navigation';
import { StoThemeService } from '@ngx-stoui/common';
import { overlayAnimation } from '../animation';

@Component({
  selector: 'sto-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: [ './nav-drawer.component.scss', './nav-drawer.theme.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation
  ]
})
export class NavDrawerComponent implements AfterViewInit {
  @Input()
  collapsed = false;
  @Input()
  navigationItems: Array<Navigation>;
  @Input()
  withAppHeader: boolean;
  @Output()
  activate = new EventEmitter();
  public headerOffset = 64;

  constructor(private themeService: StoThemeService, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.themeService
      .getActiveTypography()
      .subscribe(typography => {
        this.headerOffset = typography.name === 'small' ? 48 : 64;
        this.cdr.detectChanges();
      });
  }

  onActivate(item: Navigation) {
    this.activate.emit(item);
    // collapse? Should be handled at parent imo, otherwise un-collapsing will be a problem
  }
}

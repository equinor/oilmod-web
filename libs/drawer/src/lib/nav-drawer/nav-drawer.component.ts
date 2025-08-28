import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StoThemeService } from '@ngx-stoui/common';
import { overlayAnimation } from '../animation';
import { NavDrawerItemComponent } from './nav-drawer-item/nav-drawer-item.component';
import { Navigation } from './navigation';

@Component({
  selector: 'sto-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss', './nav-drawer.theme.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [overlayAnimation],
  imports: [MatButtonModule, MatIconModule, NavDrawerItemComponent],
})
export class NavDrawerComponent implements AfterViewInit {
  private themeService = inject(StoThemeService);
  private cdr = inject(ChangeDetectorRef);

  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  collapsed = false;
  readonly navigationItems = input<Array<Navigation>>();
  readonly withAppHeader = input<boolean>();
  readonly activate = output<Navigation>();
  public headerOffset = 64;

  ngAfterViewInit() {
    this.themeService.getActiveTypography().subscribe((typography) => {
      this.headerOffset = typography.name === 'small' ? 48 : 64;
      this.cdr.detectChanges();
    });
  }

  onActivate(item: Navigation) {
    this.activate.emit(item);
    this.collapsed = true;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, HostBinding, Input, OnDestroy, ViewEncapsulation, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Breadcrumb, BreadcrumbConfig, NAVIGATION_HOME_ICON } from './breadcrumb';

import { MatIconModule } from '@angular/material/icon';

/**
 * Breadcrumbs is the navigation scheme that reveals the user's location on the web application.
 * It shows both a home icon and the path that could be an url or a command/function (e.g open a drawer, popup etc).
 */
@Component({
    selector: 'sto-breadcrumbs',
    templateUrl: './sto-breadcrumbs.component.html',
    styleUrls: ['./sto-breadcrumbs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule, RouterLink]
})
export class StoBreadcrumbsComponent implements OnDestroy {
  private router = inject(Router);


  @HostBinding('class.sto-breadcrumb')
  css = true;
  public title: string;
  readonly homeicon = input('apps');
  readonly svgIcon = input(false);
  /**
   * An object that can contain a url segment or a command.
   */
  readonly home = input<any>();
  /**
   * DEPRECATED
   */
  readonly style = input<any>();
  /**
   * DEPRECATED
   */
  readonly styleClass = input<string>();
  /**
   * @DEPRECATED
   * The material icon that is show top left
   *  {string}
   */
  readonly homeIcon = input('home');
  public iconConfig: { icon?: string; svgIcon?: string; text?: string; };

  constructor() {
    const iconConfig = inject<BreadcrumbConfig>(NAVIGATION_HOME_ICON, { optional: true });

    this.iconConfig = iconConfig || { icon: 'apps' };
  }

  private _model: any[];

  /**
   * A list of items which can be a url segment { segment : 'inventory'} or a command {command: () => {}} .
   */
  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input() get model(): any[] {
    return this._model;
  }

  set model(model: any[]) {
    this.title = ( model || [] ).map(e => e.label || '').join(' / ');
    this._model = model;
  }

  itemClick(event: Event, item: Breadcrumb) {
    if ( !item ) {
      return;
    }
    if ( item.disabled ) {
      event.preventDefault();
      return;
    }

    if ( !item.url ) {
      event.preventDefault();
    }

    if ( item.command ) {
      if ( !item.eventEmitter ) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item
      });
    } else if ( item.segment ) {
      this.router.navigate([ item.segment ], { queryParamsHandling: 'preserve' })
        .catch(console.error);
    }
  }

  onHomeClick(event: Event) {
    const home = this.home();
    if ( home ) {
      this.itemClick(event, home);
    }
  }

  ngOnDestroy() {
    if ( this.model ) {
      for ( const item of this.model ) {
        if ( item.eventEmitter ) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }
}

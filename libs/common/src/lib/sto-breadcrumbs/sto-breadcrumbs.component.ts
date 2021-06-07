import { Component, EventEmitter, HostBinding, Inject, Input, OnDestroy, Optional, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Breadcrumb, BreadcrumbConfig, NAVIGATION_HOME_ICON } from './breadcrumb';

/**
 * Breadcrumbs is the navigation scheme that reveals the user's location on the web application.
 * It shows both a home icon and the path that could be an url or a command/function (e.g open a drawer, popup etc).
 */
@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrls: [ './sto-breadcrumbs.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class StoBreadcrumbsComponent implements OnDestroy {

  /**
   * A list of items which can be a url segment { segment : 'inventory'} or a command {command: () => {}} .
   */
  @Input() get model(): any[] {
    return this._model;
  }

  set model(model: any[]) {
    this.title = ( model || [] ).map(e => e.label || '').join(' / ');
    this._model = model;
  }

  @HostBinding('class.sto-breadcrumb')
  css = true;

  private _model: any[];
  public title: string;

  @Input()
  homeicon = 'apps';
  @Input()
  svgIcon = false;

  /**
   * An object that can contain a url segment or a command.
   */
  @Input() home: any;

  /**
   * DEPRECATED
   */
  @Input() style: any;
  /**
   * DEPRECATED
   */
  @Input() styleClass: string;
  /**
   * @DEPRECATED
   * The material icon that is show top left
   *  {string}
   */
  @Input() homeIcon = 'home';
  public iconConfig: { icon?: string; svgIcon?: string; text?: string; };

  constructor(private router: Router, @Inject(NAVIGATION_HOME_ICON) @Optional() iconConfig: BreadcrumbConfig) {
    this.iconConfig = iconConfig || { icon: 'apps' };
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
    if ( this.home ) {
      this.itemClick(event, this.home);
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

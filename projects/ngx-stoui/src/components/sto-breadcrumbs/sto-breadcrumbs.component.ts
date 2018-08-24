import { Component, EventEmitter, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

/**
 * Breadcrumbs is the navigation scheme that reveals the user's location on the web application.
 * It shows both a home icon and the path that could be an url or a command/function (e.g open a drawer, popup etc).
 */
@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrls: ['./sto-breadcrumbs.component.scss']
})
export class StoBreadcrumbsComponent {

 /**
  * A list of items which can be a url segment { segment : 'inventory'} or a command {command: () => {}} .
  */
  @Input() model: any[];

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
   * @type {string}
   */
  @Input() homeIcon = 'home';

  itemClick(event, item: any) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    } else if (item.segment) {
      this.router.navigate([item.segment], {queryParamsHandling: 'preserve'})
        .catch(console.error);
    }
  }

  onHomeClick(event) {
    if (this.home) {
      this.itemClick(event, this.home);
    }
  }

  ngOnDestroy() {
    if (this.model) {
      for (const item of this.model) {
        if (item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }
  constructor(private router: Router) {

  }
}

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [StoBreadcrumbsComponent],
  declarations: [StoBreadcrumbsComponent]
})
export class StoBreadcrumbsModule {
}

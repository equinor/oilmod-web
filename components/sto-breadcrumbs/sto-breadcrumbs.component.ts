import { Component, EventEmitter, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrls: ['./sto-breadcrumbs.component.scss']
})
export class StoBreadcrumbsComponent {
  @Input() homeIcon = 'home';

  @Input() model: any[];

  @Input() style: any;

  @Input() styleClass: string;

  @Input() home: any;

  itemClick(event, item: any) {
    if(item.disabled) {
      event.preventDefault();
      return;
    }

    if(!item.url) {
      event.preventDefault();
    }

    if(item.command) {
      if(!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    }
   else if(item.segment){
      this.router.navigate([item.segment], {queryParamsHandling: 'preserve'})
        .catch(console.error);
    }
  }

  onHomeClick(event) {
    if(this.home) {
      this.itemClick(event, this.home);
    }
  }

  ngOnDestroy() {
    if(this.model) {
      for(let item of this.model) {
        if(item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }
  constructor(private router: Router){

  }
}

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [StoBreadcrumbsComponent],
  declarations: [StoBreadcrumbsComponent]
})
export class StoBreadcrumbsModule {
}
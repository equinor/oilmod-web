import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StoBreadcrumbsComponent } from './sto-breadcrumbs.component';

@NgModule({
  imports: [ CommonModule, RouterModule, MatIconModule ],
  exports: [ StoBreadcrumbsComponent ],
  declarations: [ StoBreadcrumbsComponent ]
})
export class StoBreadcrumbsModule {
}

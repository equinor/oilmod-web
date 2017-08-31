import { Component, Input, NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from '../../vendor/primeface/components/breadcrumb/breadcrumb';

@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrls: ['./sto-breadcrumbs.component.scss']
})
export class StoBreadcrumbsComponent extends Breadcrumb {
}

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [StoBreadcrumbsComponent],
  declarations: [StoBreadcrumbsComponent]
})
export class StoBreadcrumbsModule {
}
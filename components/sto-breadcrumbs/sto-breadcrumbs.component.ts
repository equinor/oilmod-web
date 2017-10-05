import { Component, Input, NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from '../../vendor/primeface/components/breadcrumb/breadcrumb';
import { MdIconModule } from '@angular/material';

@Component({
  selector: 'sto-breadcrumbs',
  templateUrl: './sto-breadcrumbs.component.html',
  styleUrls: ['./sto-breadcrumbs.component.scss']
})
export class StoBreadcrumbsComponent extends Breadcrumb {
  @Input() homeIcon = 'home';
}

@NgModule({
  imports: [CommonModule, RouterModule, MdIconModule],
  exports: [StoBreadcrumbsComponent],
  declarations: [StoBreadcrumbsComponent]
})
export class StoBreadcrumbsModule {
}
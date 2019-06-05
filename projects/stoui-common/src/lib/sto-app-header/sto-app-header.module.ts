import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoAppHeaderComponent } from './sto-app-header.component';
import { StoBreadcrumbsModule } from '../sto-breadcrumbs/sto-breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    StoBreadcrumbsModule
  ],
  declarations: [ StoAppHeaderComponent ],
  exports: [ StoAppHeaderComponent ],
})
export class StoAppHeaderModule {
}

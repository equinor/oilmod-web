import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoAppHeaderComponent } from './sto-app-header.component';
import { StoBreadcrumbsModule } from '../sto-breadcrumbs/sto-breadcrumbs.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    StoBreadcrumbsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [ StoAppHeaderComponent ],
  exports: [ StoAppHeaderComponent ],
})
export class StoAppHeaderModule {
}

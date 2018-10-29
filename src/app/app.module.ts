import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoAppHeaderModule } from '@ngx-stoui/common';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { StoDateAdapter } from '@ngx-stoui/form';
import { DateAdapter, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';

const routes: Routes = [
  { path: '', component: RootComponent, pathMatch: 'full' },
  { path: 'common', loadChildren: './common/demo-common.module#DemoCommonModule'}
];

@NgModule({
  declarations: [
    AppComponent,
    RootComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoAppHeaderModule,
    RouterModule.forRoot(routes, {enableTracing: false})
  ],
  providers: [
    { provide: DateAdapter, useClass: StoDateAdapter },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

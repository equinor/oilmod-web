import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoAppHeaderModule, StoFilterPanelModule } from '@ngx-stoui/common';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { StoDateAdapter } from '@ngx-stoui/form';
import {
  DateAdapter,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { DocsModule } from './docs/docs.module';
import { StoUserPreferenceModule } from '@ngx-stoui/core';
import { StoDatatableModule } from '@ngx-stoui/datatable';

const routes: Routes = [
  { path: '', component: RootComponent, pathMatch: 'full' },
  { path: 'common', loadChildren: './common/demo-common.module#DemoCommonModule'},
  { path: 'form', loadChildren: './form/form.module#FormModule'},
];

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoAppHeaderModule,
    RouterModule.forRoot(routes, {enableTracing: false}),
    StoDatatableModule,
    DocsModule,
    HttpClientModule,
    StoUserPreferenceModule.forRoot(),
    MatSidenavModule,
    StoFilterPanelModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    { provide: DateAdapter, useClass: StoDateAdapter },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

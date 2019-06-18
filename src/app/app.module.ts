import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoAppHeaderModule, StoFilterPanelModule } from '@ngx-stoui/common';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { StoDateAdapter } from '@ngx-stoui/form';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { DocsModule } from './docs/docs.module';
import { StoUserPreferenceModule } from '@ngx-stoui/core';
import { StoDatatableModule } from '@ngx-stoui/datatable';

const routes: Routes = [
  { path: '', component: RootComponent, pathMatch: 'full' },
  { path: 'common', loadChildren: () => import('./common/demo-common.module').then(m => m.DemoCommonModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
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

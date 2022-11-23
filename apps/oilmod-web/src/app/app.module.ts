import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoAppHeaderComponent } from '@ngx-stoui/common';
import { NavigationComponent } from './components/navigation.component';
import { RouterModule, Routes } from '@angular/router';
import { routes as commonRoutes } from './components/common/routes';
import { routes as formRoutes } from './components/form/routes';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';

const routes: Routes = [
  { path: 'core', loadComponent: () => import('./components/core/core.component').then(c => c.CoreComponent) },
  {
    path: 'common', loadComponent: () => import('./components/common/common.component').then(c => c.CommonComponent),
    children: commonRoutes
  },
  { path: 'datatable', loadComponent: () => import('./components/datatable/datatable.component').then(c => c.DatatableComponent) },
  { path: 'drawer', loadComponent: () => import('./components/drawer/drawer.component').then(c => c.DrawerComponent) },
  { path: 'form', loadComponent: () => import('./components/form/form.component').then(c => c.FormComponent), children: formRoutes },
];

@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, StoAppHeaderComponent, NavigationComponent, RouterModule.forRoot(routes), BrowserAnimationsModule, HighlightModule ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }
    }
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}

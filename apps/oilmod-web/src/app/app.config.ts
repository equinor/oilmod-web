import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Routes } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { routes as commonRoutes } from './components/common/routes';
import { routes as formRoutes } from './components/form/routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'core',
  },
  {
    path: 'core',
    loadComponent: () =>
      import('./components/core/core.component').then((c) => c.CoreComponent),
  },
  {
    path: 'common',
    loadComponent: () =>
      import('./components/common/common.component').then(
        (c) => c.CommonComponent,
      ),
    children: commonRoutes,
  },
  {
    path: 'datatable',
    loadComponent: () =>
      import('./components/datatable/datatable.component').then(
        (c) => c.DatatableComponent,
      ),
  },
  {
    path: 'drawer',
    loadComponent: () =>
      import('./components/drawer/drawer.component').then(
        (c) => c.DrawerComponent,
      ),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./components/form/form.component').then((c) => c.FormComponent),
    children: formRoutes,
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      },
    },
  ],
};

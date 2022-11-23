import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'number-input',
    loadComponent: () => import('./routes/number-input/number-input.component').then(c => c.DemoNumberInputComponent)
  }
  // { path: 'number-input', loadComponent: () => import('').then(c => c.) }
  // { path: 'number-input', loadComponent: () => import('').then(c => c.) }
  // { path: 'number-input', loadComponent: () => import('').then(c => c.) }
  // { path: 'number-input', loadComponent: () => import('').then(c => c.) }
  // { path: 'number-input', loadComponent: () => import('').then(c => c.) }
];

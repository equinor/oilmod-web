export const routes = [
  {
    path: 'preference-manager',
    loadComponent: () => import('./routes/preference-manager.component').then(c => c.PreferenceManagerComponent)
  },
  {
    path: 'action-footer',
    loadComponent: () => import('./routes/action-footer/action-footer.component').then(c => c.ActionFooterDemoComponent)
  }
];

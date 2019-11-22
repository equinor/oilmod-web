import { InjectionToken } from '@angular/core';

export interface Breadcrumb {
  label: string;
  command?: Function;
  segment?: string;
}

export const NAVIGATION_HOME_ICON = new InjectionToken<{ icon?: string; svgIcon?: string; text?: string }>('sto-home-icon');

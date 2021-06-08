import { EventEmitter, InjectionToken } from '@angular/core';

export interface Breadcrumb {
  label: string;
  command?: (...args: Array<unknown>) => void;
  segment?: string;
  disabled?: boolean;
  eventEmitter?: EventEmitter<unknown>;
  url?: string;
}

export interface BreadcrumbConfig { icon?: string; svgIcon?: string; text?: string };

export const NAVIGATION_HOME_ICON = new InjectionToken<BreadcrumbConfig>('sto-home-icon');

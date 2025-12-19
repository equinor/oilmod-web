import { InjectionToken } from '@angular/core';

export interface BreadcrumbClickEvent {
  originalEvent: Event;
  item: Breadcrumb;
}

export interface Breadcrumb {
  label: string;
  command?: (event: BreadcrumbClickEvent) => void;
  segment?: string;
  disabled?: boolean;
  url?: string;
}

export interface BreadcrumbConfig {
  icon?: string;
  svgIcon?: string;
  text?: string;
}

export const NAVIGATION_HOME_ICON = new InjectionToken<BreadcrumbConfig>(
  'sto-home-icon',
);

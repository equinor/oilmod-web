import { InjectionToken } from '@angular/core';

export class AdalConfig {
  apiEndpoint: string;
  clientId: string;
  resource: string;
  tenantId: string;
  redirectUri: string;
  cacheLocation: 'localStorage' | 'sessionStorage' = 'sessionStorage';

  constructor(apiEndpoint: string,
              clientId: string,
              resource: string,
              tenantId: string,
              redirectUri: string,
              cacheLocation = 'sessionStorage' as any) {
    this.apiEndpoint = apiEndpoint;
    this.clientId = clientId;
    this.resource = resource;
    this.tenantId = tenantId;
    this.redirectUri = redirectUri;
    this.cacheLocation = cacheLocation;
  }
}

/**
 * Injection token to configure your application authentication.
 *
 * @usage
 * @NgModule({
 *   ...,
 *   providers: [
 *     provide: ADAL_CONFIG, useValue: new [AdalConfig]{@link AdalConfig}(...)
 *   ]
 * })
 */
export const ADAL_CONFIG = new InjectionToken<AdalConfig>('adal.config');
/**
 * Injection token to disable authentication. Useful for debugging purposes. Defaults to false
 *
 * @usage
 * @NgModule({
 *   ...,
 *   providers: [
 *     provide: ADAL_DISABLED, useValue: true
 *   ]
 * })
 */
export const ADAL_DISABLED = new InjectionToken<boolean>('adal.disabled');

export const ADAL_LOGOUT_URL = new InjectionToken<string>('adal.logoutUri');
export const ADAL_REDIR_LOGIN = new InjectionToken<boolean>('adal.redirectAfterLogin');

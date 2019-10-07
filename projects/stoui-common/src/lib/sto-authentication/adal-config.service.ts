import { Inject, Injectable, Optional } from '@angular/core';
import { ADAL_CONFIG, ADAL_LOGOUT_URL, ADAL_REDIR_LOGIN, AdalConfig } from './adal.config';

@Injectable({
  providedIn: 'root'
})
export class AdalConfigService {

  constructor(
    @Inject(ADAL_CONFIG) private config: AdalConfig
    , @Inject(ADAL_LOGOUT_URL) @Optional() private logoutUrl: string
    , @Inject(ADAL_REDIR_LOGIN) @Optional() private navigateToLoginRequestUrl = true
  ) {
  }

  get adalSettings() {
    return {
      tentant: this.config.tenantId,
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      postLogoutRedirectUri: this.logoutUrl ? this.logoutUrl : window.location.origin,
      navigateToLoginRequestUrl: this.navigateToLoginRequestUrl,
      cacheLocation: this.config.cacheLocation || 'sessionStorage'
    };
  }
}

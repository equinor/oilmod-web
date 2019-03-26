import { Inject, Injectable, Optional } from '@angular/core';
import { AdalConfigService } from './adal-config.service';
import * as AuthenticationContext from 'adal-angular';
import { Observable, Subscriber } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ADAL_DISABLED } from './adal.config';


@Injectable({
  providedIn: 'root'
})
export class AdalService {
  private readonly context: AuthenticationContext;

  constructor(private configService: AdalConfigService, @Inject(ADAL_DISABLED) @Optional() private authDisabled: boolean) {
    this.context = new AuthenticationContext(configService.adalSettings);
  }

  public login() {
    this.context.login();
  }

  public logout() {
    this.context.logOut();
  }

  public handleCallback(hash = window.location.hash) {
    return new Promise(resolve => {
      this.context.handleWindowCallback(hash);
      setTimeout(() => resolve(), 300);
    });
  }

  public get authContext() {
    return this.context;
  }

  public get userInfo() {
    return this.context.getCachedUser();
  }

  public get accessToken() {
    return this.context.getCachedToken(this.configService.adalSettings.clientId);
  }

  public acquireTokenResilient(resource: string): Observable<any> {
    return new Observable<any>((subscriber: Subscriber<any>) =>
      this.context.acquireToken(resource, (message: string, token: string) => {
        if ( token ) {
          subscriber.next(token);
          subscriber.complete();
        } else if ( this.authDisabled ) {
          subscriber.next(null);
          subscriber.complete();
        } else {
          subscriber.error(message);
        }
      })
    ).pipe(retry(3));
  }
}

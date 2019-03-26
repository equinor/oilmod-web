import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';
import { ADAL_DISABLED } from './adal.config';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for private routes - if the user is not authenticated, attempt logging in.
 */
export class AuthenticationGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const hasUserInfo = !!this.adalService.userInfo;
    const isOk = hasUserInfo || this.disableAuth;
    if ( !isOk ) {
      this.adalService.login();
    }
    return isOk;
  }

  constructor(private adalService: AdalService, @Inject(ADAL_DISABLED) private disableAuth: boolean) {
  }
}

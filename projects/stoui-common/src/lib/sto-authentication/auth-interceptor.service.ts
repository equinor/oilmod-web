import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';
import { ADAL_CONFIG, AdalConfig } from './adal.config';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private adalService: AdalService, @Inject(ADAL_CONFIG) private config: AdalConfig) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiUrl = this.config.apiEndpoint;
    const url = req.url;
    // Only handle if apiUrl is not set (=all), or if the request url does not start with the apiUrl definition
    if ( !apiUrl || !url.startsWith(apiUrl) ) {
      return next.handle(req);
    }
    return this.adalService.acquireTokenResilient(this.config.resource)
      .pipe(
        mergeMap(token => {
          if ( token ) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next.handle(req);
        })
      );
  }
}
